import { DataSource, Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod, PaymentProvider } from '../entities/tenant/Payment';
import { PaymentTransaction } from '../entities/tenant/PaymentTransaction';
import { PaymentMethodEntity } from '../entities/tenant/PaymentMethod';

export class PaymentRepository {
  private paymentRepo: Repository<Payment>;
  private transactionRepo: Repository<PaymentTransaction>;
  private methodRepo: Repository<PaymentMethodEntity>;

  constructor(private dataSource: DataSource) {
    this.paymentRepo = this.dataSource.getRepository(Payment);
    this.transactionRepo = this.dataSource.getRepository(PaymentTransaction);
    this.methodRepo = this.dataSource.getRepository(PaymentMethodEntity);
  }

  // Payment Methods
  async findPaymentById(id: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({
      where: { id },
      relations: { transactions: true, sale: true, order: true, createdBy: true },
    });
  }

  async findPaymentByProviderTransactionId(transactionId: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({
      where: { providerTransactionId: transactionId },
      relations: { transactions: true, sale: true, order: true },
    });
  }

  async findPaymentsBySaleId(saleId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { saleId },
      relations: { transactions: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findPaymentsByOrderId(orderId: number): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { orderId },
      relations: { transactions: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findPaymentsByStatus(status: PaymentStatus, limit: number = 100): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { status },
      relations: { sale: true, order: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return this.paymentRepo
      .createQueryBuilder('payment')
      .where('payment.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentRepo.create(data);
    return this.paymentRepo.save(payment);
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment> {
    await this.paymentRepo.update(id, data);
    return this.findPaymentById(id) as Promise<Payment>;
  }

  async updatePaymentStatus(id: string, status: PaymentStatus, paidAt?: Date): Promise<Payment> {
    const updateData: Partial<Payment> = { status };
    if (paidAt) {
      updateData.paidAt = paidAt;
    }
    return this.updatePayment(id, updateData);
  }

  // Payment Transactions
  async createTransaction(data: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    const transaction = this.transactionRepo.create(data);
    return this.transactionRepo.save(transaction);
  }

  async findTransactionsByPaymentId(paymentId: string): Promise<PaymentTransaction[]> {
    return this.transactionRepo.find({
      where: { paymentId },
      order: { createdAt: 'DESC' },
    });
  }

  async findTransactionById(id: string): Promise<PaymentTransaction | null> {
    return this.transactionRepo.findOne({
      where: { id },
      relations: { payment: true },
    });
  }

  // Payment Methods
  async createPaymentMethod(data: Partial<PaymentMethodEntity>): Promise<PaymentMethodEntity> {
    const method = this.methodRepo.create(data);
    return this.methodRepo.save(method);
  }

  async findPaymentMethodById(id: string): Promise<PaymentMethodEntity | null> {
    return this.methodRepo.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findPaymentMethodsByUserId(userId: string): Promise<PaymentMethodEntity[]> {
    return this.methodRepo.find({
      where: { userId, isActive: true },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findDefaultPaymentMethod(userId: string): Promise<PaymentMethodEntity | null> {
    return this.methodRepo.findOne({
      where: { userId, isDefault: true, isActive: true },
    });
  }

  async updatePaymentMethod(id: string, data: Partial<PaymentMethodEntity>): Promise<PaymentMethodEntity> {
    await this.methodRepo.update(id, data);
    return this.findPaymentMethodById(id) as Promise<PaymentMethodEntity>;
  }

  async deletePaymentMethod(id: string): Promise<void> {
    await this.methodRepo.update(id, { isActive: false });
  }

  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<void> {
    // Desativar outros métodos padrão
    await this.methodRepo.update({ userId, isDefault: true }, { isDefault: false });

    // Ativar novo método padrão
    await this.methodRepo.update(methodId, { isDefault: true });
  }

  // Statistics
  async getTotalPaymentsByStatus(status: PaymentStatus): Promise<number> {
    return this.paymentRepo.count({ where: { status } });
  }

  async getTotalAmountByStatus(status: PaymentStatus): Promise<number> {
    const result = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status })
      .getRawOne();

    return result?.total || 0;
  }

  async getPaymentStats(startDate: Date, endDate: Date): Promise<any> {
    return this.paymentRepo
      .createQueryBuilder('payment')
      .select('payment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('payment.status')
      .getRawMany();
  }

  async getPaymentsByProvider(provider: PaymentProvider): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { provider },
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentsByMethod(method: PaymentMethod): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { method },
      order: { createdAt: 'DESC' },
    });
  }
}
