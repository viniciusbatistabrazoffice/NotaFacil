import { Sale, SaleStatus, SalePaymentStatus } from '../entities/tenant/Sale';
import { SaleItem } from '../entities/tenant/SaleItem';
import { getSaleRepository, getSaleItemRepository } from '../repositories/sale.repository';
import { getProductRepository } from '../repositories/product.repository';
import { getClientRepository } from '../repositories/client.repository';
import { getFinancialTransactionRepository } from '../repositories/financial.repository';
import { FinancialTransactionType, FinancialTransactionStatus, PaymentMethod } from '../entities/tenant/FinancialTransaction';

interface CreateSaleItemInput {
  productId?: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  discount?: number;
  size?: string;
}

interface CreateSaleInput {
  clientId?: string;
  clientName?: string;
  items: CreateSaleItemInput[];
  discount?: number;
  notes?: string;
}

interface CompleteSaleInput {
  amountPaid: number;
  paymentMethod?: string;
}

interface SaleResponse {
  id: string;
  status: SaleStatus;
  paymentStatus: SalePaymentStatus;
  clientName: string | null;
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  items: SaleItem[];
  createdAt: Date;
}

export class SaleService {
  async createSale(schemaName: string, data: CreateSaleInput, userId: string): Promise<Sale> {
    const saleRepository = await getSaleRepository(schemaName);
    const saleItemRepository = await getSaleItemRepository(schemaName);
    const productRepository = await getProductRepository(schemaName);

    if (!data.items || data.items.length === 0) {
      throw new Error('Sale must have at least one item');
    }

    // Validate and calculate items
    let subtotal = 0;
    const validatedItems: CreateSaleItemInput[] = [];

    for (const item of data.items) {
      if (!item.productName || item.unitPrice < 0 || item.quantity <= 0) {
        throw new Error('Invalid item data: productName, unitPrice, and quantity are required');
      }

      const discount = item.discount || 0;
      const itemSubtotal = item.unitPrice * item.quantity - discount;
      subtotal += itemSubtotal;
      validatedItems.push(item);
    }

    const discount = data.discount || 0;
    const total = Math.max(0, subtotal - discount);

    // Create sale
    const sale = saleRepository.create({
      clientId: data.clientId,
      clientName: data.clientName || null,
      subtotal,
      discount,
      total,
      amountPaid: 0,
      change: 0,
      notes: data.notes || null,
      status: SaleStatus.Open,
      paymentStatus: SalePaymentStatus.Pending,
      createdById: userId,
    });

    const savedSale = await saleRepository.save(sale);

    // Create sale items
    for (const item of validatedItems) {
      const itemSubtotal = item.unitPrice * item.quantity - (item.discount || 0);
      const saleItem = saleItemRepository.create({
        saleId: savedSale.id,
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        discount: item.discount || 0,
        subtotal: itemSubtotal,
        size: item.size || null,
      });
      await saleItemRepository.save(saleItem);
    }

    return this.findById(schemaName, savedSale.id);
  }

  async findById(schemaName: string, id: string): Promise<Sale> {
    const repository = await getSaleRepository(schemaName);
    const sale = await repository.findOne({
      where: { id },
      relations: ['items', 'createdBy', 'client'],
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    return sale;
  }

  async findAll(schemaName: string, filters?: { status?: SaleStatus; startDate?: string; endDate?: string }): Promise<Sale[]> {
    const repository = await getSaleRepository(schemaName);
    const query = repository.createQueryBuilder('sale').leftJoinAndSelect('sale.items', 'items').orderBy('sale.createdAt', 'DESC');

    if (filters?.status) {
      query.andWhere('sale.status = :status', { status: filters.status });
    }

    if (filters?.startDate) {
      query.andWhere('sale.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('sale.createdAt <= :endDate', { endDate: filters.endDate });
    }

    return query.getMany();
  }

  async completeSale(schemaName: string, saleId: string, data: CompleteSaleInput, userId: string): Promise<Sale> {
    const sale = await this.findById(schemaName, saleId);

    if (sale.status !== SaleStatus.Open) {
      throw new Error('Sale is not open');
    }

    if (data.amountPaid < 0) {
      throw new Error('Amount paid must be non-negative');
    }

    const change = Math.max(0, data.amountPaid - sale.total);
    const amountPaid = Math.min(data.amountPaid, sale.total);

    let paymentStatus = SalePaymentStatus.Pending;
    if (amountPaid >= sale.total) {
      paymentStatus = SalePaymentStatus.Paid;
    } else if (amountPaid > 0) {
      paymentStatus = SalePaymentStatus.PartiallyPaid;
    }

    const saleRepository = await getSaleRepository(schemaName);
    sale.status = SaleStatus.Completed;
    sale.paymentStatus = paymentStatus;
    sale.amountPaid = amountPaid;
    sale.change = change;

    const updatedSale = await saleRepository.save(sale);

    // Create financial transaction for the payment
    if (amountPaid > 0) {
      const financialRepository = await getFinancialTransactionRepository(schemaName);
      const transaction = financialRepository.create({
        type: FinancialTransactionType.Income,
        amount: amountPaid,
        description: `Venda #${saleId.substring(0, 8)} - ${sale.clientName || 'Cliente sem registro'}`,
        category: 'SALE',
        status: FinancialTransactionStatus.Settled,
        paymentMethod: (data.paymentMethod as any) || PaymentMethod.Cash,
        createdById: userId,
        settledAt: new Date(),
      });
      await financialRepository.save(transaction);
    }

    return updatedSale;
  }

  async cancelSale(schemaName: string, saleId: string): Promise<Sale> {
    const sale = await this.findById(schemaName, saleId);

    if (sale.status === SaleStatus.Cancelled) {
      throw new Error('Sale is already cancelled');
    }

    const saleRepository = await getSaleRepository(schemaName);
    sale.status = SaleStatus.Cancelled;
    return saleRepository.save(sale);
  }

  async updateSaleItem(schemaName: string, saleId: string, itemId: string, data: Partial<CreateSaleItemInput>): Promise<Sale> {
    const sale = await this.findById(schemaName, saleId);

    if (sale.status !== SaleStatus.Open) {
      throw new Error('Cannot modify items of a completed or cancelled sale');
    }

    const saleItemRepository = await getSaleItemRepository(schemaName);
    const item = await saleItemRepository.findOneBy({ id: itemId, saleId });

    if (!item) {
      throw new Error('Sale item not found');
    }

    if (data.unitPrice !== undefined) item.unitPrice = data.unitPrice;
    if (data.quantity !== undefined) item.quantity = data.quantity;
    if (data.discount !== undefined) item.discount = data.discount;
    if (data.size !== undefined) item.size = data.size;

    item.subtotal = item.unitPrice * item.quantity - item.discount;
    await saleItemRepository.save(item);

    // Recalculate sale totals
    const items = await saleItemRepository.find({ where: { saleId } });
    let subtotal = 0;
    items.forEach((i) => {
      subtotal += i.subtotal;
    });

    const saleRepository = await getSaleRepository(schemaName);
    sale.subtotal = subtotal;
    sale.total = Math.max(0, subtotal - sale.discount);
    return saleRepository.save(sale);
  }

  async removeSaleItem(schemaName: string, saleId: string, itemId: string): Promise<Sale> {
    const sale = await this.findById(schemaName, saleId);

    if (sale.status !== SaleStatus.Open) {
      throw new Error('Cannot modify items of a completed or cancelled sale');
    }

    const saleItemRepository = await getSaleItemRepository(schemaName);
    const item = await saleItemRepository.findOneBy({ id: itemId, saleId });

    if (!item) {
      throw new Error('Sale item not found');
    }

    await saleItemRepository.remove(item);

    // Recalculate sale totals
    const items = await saleItemRepository.find({ where: { saleId } });
    let subtotal = 0;
    items.forEach((i) => {
      subtotal += i.subtotal;
    });

    const saleRepository = await getSaleRepository(schemaName);
    sale.subtotal = subtotal;
    sale.total = Math.max(0, subtotal - sale.discount);
    return saleRepository.save(sale);
  }

  async getDailySalesReport(schemaName: string, date?: string): Promise<any> {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const repository = await getSaleRepository(schemaName);
    const sales = await repository
      .createQueryBuilder('sale')
      .where('sale.createdAt BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
      .andWhere('sale.status = :status', { status: SaleStatus.Completed })
      .leftJoinAndSelect('sale.items', 'items')
      .orderBy('sale.createdAt', 'DESC')
      .getMany();

    let totalSales = 0;
    let totalItems = 0;
    let totalDiscount = 0;
    let totalRevenue = 0;

    sales.forEach((sale) => {
      totalSales += 1;
      totalItems += sale.items.length;
      totalDiscount += sale.discount;
      totalRevenue += sale.total;
    });

    return {
      date: targetDate.toISOString().split('T')[0],
      totalSales,
      totalItems,
      totalDiscount,
      totalRevenue,
      averageSaleValue: totalSales > 0 ? totalRevenue / totalSales : 0,
      sales,
    };
  }

  async getSalesMetrics(schemaName: string, startDate?: string, endDate?: string): Promise<any> {
    const repository = await getSaleRepository(schemaName);
    const query = repository.createQueryBuilder('sale').where('sale.status = :status', { status: SaleStatus.Completed });

    if (startDate) {
      query.andWhere('sale.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('sale.createdAt <= :endDate', { endDate });
    }

    const sales = await query.leftJoinAndSelect('sale.items', 'items').getMany();

    let totalSales = 0;
    let totalRevenue = 0;
    let totalDiscount = 0;
    let totalItems = 0;
    let paidSales = 0;
    let partiallyPaidSales = 0;

    sales.forEach((sale) => {
      totalSales += 1;
      totalRevenue += sale.total;
      totalDiscount += sale.discount;
      totalItems += sale.items.length;

      if (sale.paymentStatus === SalePaymentStatus.Paid) {
        paidSales += 1;
      } else if (sale.paymentStatus === SalePaymentStatus.PartiallyPaid) {
        partiallyPaidSales += 1;
      }
    });

    return {
      totalSales,
      totalRevenue,
      totalDiscount,
      totalItems,
      averageSaleValue: totalSales > 0 ? totalRevenue / totalSales : 0,
      paidSales,
      partiallyPaidSales,
      unpaidSales: totalSales - paidSales - partiallyPaidSales,
    };
  }
}
