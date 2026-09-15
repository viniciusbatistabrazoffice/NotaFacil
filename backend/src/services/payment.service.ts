import { DataSource } from 'typeorm';
import { PaymentRepository } from '../repositories/payment.repository';
import { Payment, PaymentStatus, PaymentMethod, PaymentProvider } from '../entities/tenant/Payment';
import { PaymentTransaction, TransactionType, TransactionStatus } from '../entities/tenant/PaymentTransaction';
import { PaymentGatewayFactory } from '../payment/PaymentGatewayFactory';
import { IPaymentRequest, IPaymentResponse, IRefundRequest, IRefundResponse } from '../payment/interfaces/IPaymentGateway';

export class PaymentService {
  private repository: PaymentRepository;

  constructor(private dataSource: DataSource) {
    this.repository = new PaymentRepository(this.dataSource);
  }

  /**
   * Processa um pagamento
   */
  async processPayment(
    saleId: string | null,
    orderId: number | null,
    amount: number,
    method: PaymentMethod,
    provider: PaymentProvider,
    cardToken?: string,
    metadata?: Record<string, any>
  ): Promise<Payment> {
    try {
      // Criar registro de pagamento
      const payment = await this.repository.createPayment({
        saleId,
        orderId,
        amount,
        method,
        provider,
        status: PaymentStatus.Processing,
        metadata,
      });

      // Obter gateway de pagamento
      const gateway = PaymentGatewayFactory.createGateway(provider);

      // Preparar requisição
      const paymentRequest: IPaymentRequest = {
        amount,
        currency: 'BRL',
        method,
        description: `Payment for ${saleId ? 'Sale' : 'Order'} #${saleId || orderId}`,
        reference: payment.id,
        cardToken,
        metadata,
      };

      // Processar pagamento
      const response = await gateway.processPayment(paymentRequest);

      // Atualizar registro de pagamento
      await this.repository.updatePayment(payment.id, {
        status: response.status,
        providerTransactionId: response.transactionId,
        amountPaid: response.status === PaymentStatus.Captured ? amount : 0,
        paidAt: response.status === PaymentStatus.Captured ? new Date() : null,
      });

      // Criar transação
      await this.repository.createTransaction({
        paymentId: payment.id,
        type: TransactionType.Capture,
        status: response.status === PaymentStatus.Captured ? TransactionStatus.Success : TransactionStatus.Failed,
        amount,
        providerTransactionId: response.transactionId,
        authorizationCode: response.authorizationCode,
        message: response.message,
        responseData: response.metadata,
      });

      return this.repository.findPaymentById(payment.id) as Promise<Payment>;
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  /**
   * Autoriza um pagamento sem capturar
   */
  async authorizePayment(
    saleId: string | null,
    orderId: number | null,
    amount: number,
    method: PaymentMethod,
    provider: PaymentProvider,
    cardToken?: string
  ): Promise<Payment> {
    try {
      const payment = await this.repository.createPayment({
        saleId,
        orderId,
        amount,
        method,
        provider,
        status: PaymentStatus.Authorized,
        metadata: { authorized: true },
      });

      const gateway = PaymentGatewayFactory.createGateway(provider);

      const paymentRequest: IPaymentRequest = {
        amount,
        currency: 'BRL',
        method,
        description: `Authorization for ${saleId ? 'Sale' : 'Order'} #${saleId || orderId}`,
        reference: payment.id,
        cardToken,
      };

      const response = await gateway.authorizePayment(paymentRequest);

      await this.repository.updatePayment(payment.id, {
        status: PaymentStatus.Authorized,
        providerTransactionId: response.transactionId,
      });

      await this.repository.createTransaction({
        paymentId: payment.id,
        type: TransactionType.Authorization,
        status: TransactionStatus.Success,
        amount,
        providerTransactionId: response.transactionId,
        message: response.message,
      });

      return this.repository.findPaymentById(payment.id) as Promise<Payment>;
    } catch (error) {
      throw new Error(`Payment authorization failed: ${error.message}`);
    }
  }

  /**
   * Captura um pagamento autorizado
   */
  async capturePayment(paymentId: string, amount?: number): Promise<Payment> {
    try {
      const payment = await this.repository.findPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== PaymentStatus.Authorized) {
        throw new Error('Payment is not authorized');
      }

      const gateway = PaymentGatewayFactory.createGateway(payment.provider);
      const response = await gateway.capturePayment(payment.providerTransactionId || paymentId, amount);

      const captureAmount = amount || payment.amount;

      await this.repository.updatePayment(paymentId, {
        status: response.status,
        amountPaid: captureAmount,
        paidAt: new Date(),
      });

      await this.repository.createTransaction({
        paymentId,
        type: TransactionType.Capture,
        status: response.status === PaymentStatus.Captured ? TransactionStatus.Success : TransactionStatus.Failed,
        amount: captureAmount,
        providerTransactionId: response.transactionId,
        message: response.message,
      });

      return this.repository.findPaymentById(paymentId) as Promise<Payment>;
    } catch (error) {
      throw new Error(`Payment capture failed: ${error.message}`);
    }
  }

  /**
   * Reembolsa um pagamento
   */
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<Payment> {
    try {
      const payment = await this.repository.findPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== PaymentStatus.Captured) {
        throw new Error('Only captured payments can be refunded');
      }

      const refundAmount = amount || payment.amount;

      if (refundAmount > payment.amountPaid) {
        throw new Error('Refund amount exceeds paid amount');
      }

      const gateway = PaymentGatewayFactory.createGateway(payment.provider);

      const refundRequest: IRefundRequest = {
        paymentId: payment.providerTransactionId || paymentId,
        amount: refundAmount,
        reason,
      };

      const response = await gateway.refundPayment(refundRequest);

      const newAmountRefunded = (payment.amountRefunded || 0) + refundAmount;
      const newStatus = newAmountRefunded >= payment.amount ? PaymentStatus.Refunded : PaymentStatus.Captured;

      await this.repository.updatePayment(paymentId, {
        status: newStatus,
        amountRefunded: newAmountRefunded,
        refundedAt: new Date(),
      });

      await this.repository.createTransaction({
        paymentId,
        type: TransactionType.Refund,
        status: TransactionStatus.Success,
        amount: refundAmount,
        providerTransactionId: response.transactionId,
        message: response.message,
      });

      return this.repository.findPaymentById(paymentId) as Promise<Payment>;
    } catch (error) {
      throw new Error(`Payment refund failed: ${error.message}`);
    }
  }

  /**
   * Obtém o status de um pagamento
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const payment = await this.repository.findPaymentById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      const gateway = PaymentGatewayFactory.createGateway(payment.provider);
      return gateway.getPaymentStatus(payment.providerTransactionId || paymentId);
    } catch (error) {
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  /**
   * Processa um webhook de pagamento
   */
  async processWebhook(provider: PaymentProvider, type: string, data: Record<string, any>): Promise<any> {
    try {
      const gateway = PaymentGatewayFactory.createGateway(provider);

      // Validar webhook
      const isValid = await gateway.validateWebhook({ provider, type, data });
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      // Processar webhook
      const result = await gateway.processWebhook({ provider, type, data });

      if (result && result.transactionId) {
        const payment = await this.repository.findPaymentByProviderTransactionId(result.transactionId);

        if (payment) {
          await this.repository.updatePaymentStatus(payment.id, result.status);

          // Criar transação de webhook
          await this.repository.createTransaction({
            paymentId: payment.id,
            type: TransactionType.Capture,
            status: result.status === PaymentStatus.Captured ? TransactionStatus.Success : TransactionStatus.Failed,
            amount: payment.amount,
            providerTransactionId: result.transactionId,
            message: `Webhook: ${type}`,
            responseData: data,
          });
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  /**
   * Obtém pagamentos por venda
   */
  async getPaymentsBySaleId(saleId: string): Promise<Payment[]> {
    return this.repository.findPaymentsBySaleId(saleId);
  }

  /**
   * Obtém pagamentos por pedido
   */
  async getPaymentsByOrderId(orderId: number): Promise<Payment[]> {
    return this.repository.findPaymentsByOrderId(orderId);
  }

  /**
   * Obtém pagamentos por status
   */
  async getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]> {
    return this.repository.findPaymentsByStatus(status);
  }

  /**
   * Obtém estatísticas de pagamento
   */
  async getPaymentStats(startDate: Date, endDate: Date): Promise<any> {
    return this.repository.getPaymentStats(startDate, endDate);
  }

  /**
   * Obtém provedores disponíveis
   */
  getAvailableProviders(): PaymentProvider[] {
    return PaymentGatewayFactory.getAvailableProviders();
  }
}
