import { Order } from '../entities/tenant/Order';
import { User } from '../entities/tenant/User';
import {
  FinancialTransaction,
  FinancialTransactionStatus,
  FinancialTransactionType,
  PaymentMethod,
} from '../entities/tenant/FinancialTransaction';
import { getFinancialTransactionRepository } from '../repositories/financial.repository';
import { getOrderRepository } from '../repositories/order.repository';
import { getUserRepository } from '../repositories/user.repository';

interface TransactionFilters {
  type?: string;
  status?: string;
}

interface SaveTransactionInput {
  description?: string;
  category?: string;
  type?: FinancialTransactionType;
  amount?: number;
  status?: FinancialTransactionStatus;
  dueDate?: string | null;
  paymentMethod?: PaymentMethod | null;
  orderId?: number | null;
}

function isTransactionType(value: string): value is FinancialTransactionType {
  return Object.values(FinancialTransactionType).includes(value as FinancialTransactionType);
}

function isTransactionStatus(value: string): value is FinancialTransactionStatus {
  return Object.values(FinancialTransactionStatus).includes(value as FinancialTransactionStatus);
}

function isPaymentMethod(value: string): value is PaymentMethod {
  return Object.values(PaymentMethod).includes(value as PaymentMethod);
}

function validateInput(data: SaveTransactionInput, isCreate: boolean): void {
  if (isCreate && (!data.description?.trim() || !data.category?.trim() || !data.type)) {
    throw new Error('Description, category and type are required');
  }
  if (data.type && !isTransactionType(data.type)) {
    throw new Error('Invalid financial transaction type');
  }
  if (data.status && !isTransactionStatus(data.status)) {
    throw new Error('Invalid financial transaction status');
  }
  if (data.paymentMethod && !isPaymentMethod(data.paymentMethod)) {
    throw new Error('Invalid payment method');
  }
  if (data.amount !== undefined && (!Number.isFinite(data.amount) || data.amount <= 0)) {
    throw new Error('Amount must be greater than zero');
  }
  if (isCreate && data.amount === undefined) {
    throw new Error('Amount must be greater than zero');
  }
}

export class FinancialService {
  async findAll(schemaName: string, filters: TransactionFilters = {}) {
    if (filters.type && !isTransactionType(filters.type)) {
      throw new Error('Invalid financial transaction type');
    }
    if (filters.status && !isTransactionStatus(filters.status)) {
      throw new Error('Invalid financial transaction status');
    }

    const repository = await getFinancialTransactionRepository(schemaName);
    const query = repository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.order', 'order')
      .leftJoinAndSelect('transaction.createdBy', 'createdBy')
      .orderBy('transaction.dueDate', 'ASC', 'NULLS LAST')
      .addOrderBy('transaction.createdAt', 'DESC');

    if (filters.type) query.andWhere('transaction.type = :type', { type: filters.type });
    if (filters.status) query.andWhere('transaction.status = :status', { status: filters.status });
    return query.getMany();
  }

  async create(schemaName: string, data: SaveTransactionInput, userId?: string) {
    validateInput(data, true);
    const order = await this.getOrder(schemaName, data.orderId);
    const createdBy = await this.getUser(schemaName, userId);
    const repository = await getFinancialTransactionRepository(schemaName);
    const status = data.status ?? FinancialTransactionStatus.Pending;
    const transaction = repository.create({
      description: data.description!.trim(),
      category: data.category!.trim(),
      type: data.type!,
      amount: data.amount!,
      status,
      dueDate: data.dueDate ?? null,
      paymentMethod: data.paymentMethod ?? null,
      settledAt: status === FinancialTransactionStatus.Settled ? new Date() : null,
      order,
      createdBy,
    });
    return repository.save(transaction);
  }

  async update(schemaName: string, id: string, data: SaveTransactionInput) {
    validateInput(data, false);
    const repository = await getFinancialTransactionRepository(schemaName);
    const transaction = await repository.findOneBy({ id });
    if (!transaction) throw new Error('Financial transaction not found');

    const order = data.orderId === undefined ? undefined : await this.getOrder(schemaName, data.orderId);
    const status = data.status ?? transaction.status;
    repository.merge(transaction, {
      ...data,
      description: data.description?.trim(),
      category: data.category?.trim(),
      order,
      settledAt:
        status === FinancialTransactionStatus.Settled && transaction.status !== FinancialTransactionStatus.Settled
          ? new Date()
          : status !== FinancialTransactionStatus.Settled
            ? null
            : transaction.settledAt,
    });
    return repository.save(transaction);
  }

  async delete(schemaName: string, id: string): Promise<void> {
    const repository = await getFinancialTransactionRepository(schemaName);
    const transaction = await repository.findOneBy({ id });
    if (!transaction) throw new Error('Financial transaction not found');
    await repository.remove(transaction);
  }

  async getCashSummary(schemaName: string) {
    const transactions = await this.findAll(schemaName, { status: FinancialTransactionStatus.Settled });
    const income = this.sum(transactions, FinancialTransactionType.Income);
    const expense = this.sum(transactions, FinancialTransactionType.Expense);
    return { balance: income - expense, income, expense, transactions };
  }

  async getOverview(schemaName: string) {
    const transactions = await this.findAll(schemaName);
    const settled = transactions.filter((item) => item.status === FinancialTransactionStatus.Settled);
    const pending = transactions.filter((item) => item.status === FinancialTransactionStatus.Pending);
    const income = this.sum(settled, FinancialTransactionType.Income);
    const expense = this.sum(settled, FinancialTransactionType.Expense);
    return {
      income,
      expense,
      netIncome: income - expense,
      accountsReceivable: this.sum(pending, FinancialTransactionType.Income),
      accountsPayable: this.sum(pending, FinancialTransactionType.Expense),
    };
  }

  async getReport(schemaName: string) {
    const transactions = await this.findAll(schemaName);
    const overview = await this.getOverview(schemaName);
    const orderRepository = await getOrderRepository(schemaName);
    const orders = await orderRepository.find({ relations: { items: true } });
    const settledIncome = transactions.filter(
      (item) =>
        item.type === FinancialTransactionType.Income &&
        item.status === FinancialTransactionStatus.Settled,
    );
    const expensesByCategory = transactions
      .filter((item) => item.type === FinancialTransactionType.Expense)
      .reduce<Record<string, number>>((totals, item) => {
        totals[item.category] = (totals[item.category] ?? 0) + item.amount;
        return totals;
      }, {});
    const revenueByClient = settledIncome.reduce<
      Record<string, { name: string; orderIds: Set<number>; value: number }>
    >((totals, item) => {
      const name = item.order?.clientName ?? 'Lançamentos sem pedido';
      const current = totals[name] ?? { name, orderIds: new Set<number>(), value: 0 };
      if (item.order) current.orderIds.add(item.order.id);
      current.value += item.amount;
      totals[name] = current;
      return totals;
    }, {});
    const products = orders
      .flatMap((order) => order.items)
      .reduce<Record<string, { name: string; quantity: number; value: number }>>(
        (totals, item) => {
          const current = totals[item.productName] ?? {
            name: item.productName,
            quantity: 0,
            value: 0,
          };
          current.quantity += item.quantity;
          current.value += item.quantity * item.unitPrice;
          totals[item.productName] = current;
          return totals;
        },
        {},
      );
    const monthlyRevenue = settledIncome.reduce<Record<string, number>>((totals, item) => {
      const date = item.settledAt ?? item.dueDate ?? item.createdAt;
      const month = date instanceof Date ? date.toISOString().slice(0, 7) : String(date).slice(0, 7);
      totals[month] = (totals[month] ?? 0) + item.amount;
      return totals;
    }, {});

    return {
      ...overview,
      expensesByCategory,
      completedOrders: orders.filter((order) => order.status === 'finished' || order.status === 'invoiced').length,
      ticketAverage: settledIncome.length ? overview.income / settledIncome.length : 0,
      revenueByClient: Object.values(revenueByClient)
        .map(({ orderIds, ...client }) => ({ ...client, orders: orderIds.size }))
        .sort((first, second) => second.value - first.value),
      products: Object.values(products).sort((first, second) => second.value - first.value),
      monthlyRevenue,
    };
  }

  private sum(transactions: FinancialTransaction[], type: FinancialTransactionType): number {
    return transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  private async getOrder(schemaName: string, orderId?: number | null): Promise<Order | null> {
    if (orderId == null) return null;
    if (!Number.isInteger(orderId) || orderId <= 0) throw new Error('Invalid order id');
    const repository = await getOrderRepository(schemaName);
    const order = await repository.findOneBy({ id: orderId });
    if (!order) throw new Error('Order not found');
    return order;
  }

  private async getUser(schemaName: string, userId?: string): Promise<User | null> {
    if (!userId) return null;
    const repository = await getUserRepository(schemaName);
    return repository.findOneBy({ id: userId });
  }
}