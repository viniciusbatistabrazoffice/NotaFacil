import axios, { AxiosInstance } from 'axios';
import {
  IPaymentGateway,
  IPaymentRequest,
  IPaymentResponse,
  IRefundRequest,
  IRefundResponse,
  IWebhookPayload,
} from '../interfaces/IPaymentGateway';
import { PaymentStatus, PaymentProvider, PaymentMethod } from '../../entities/tenant/Payment';

export class MercadoPagoGateway implements IPaymentGateway {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: 'https://api.mercadopago.com/v1',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async processPayment(request: IPaymentRequest): Promise<IPaymentResponse> {
    try {
      const response = await this.client.post('/payments', {
        transaction_amount: request.amount,
        payment_method_id: this.mapPaymentMethod(request.method),
        payer: {
          email: request.metadata?.email,
        },
        description: request.description,
        external_reference: request.reference,
        token: request.cardToken,
        installments: request.metadata?.installments || 1,
        statement_descriptor: request.metadata?.statementDescriptor,
      });

      const payment = response.data;

      return {
        id: payment.id.toString(),
        transactionId: payment.id.toString(),
        status: this.mapMercadoPagoStatus(payment.status),
        amount: request.amount,
        currency: 'BRL',
        method: request.method,
        provider: PaymentProvider.MercadoPago,
        authorizationCode: payment.authorization_code,
        message: payment.status_detail,
        metadata: {
          paymentMethodId: payment.payment_method_id,
          installments: payment.installments,
        },
      };
    } catch (error) {
      throw new Error(`Mercado Pago payment error: ${error.response?.data?.message || error.message}`);
    }
  }

  async authorizePayment(request: IPaymentRequest): Promise<IPaymentResponse> {
    try {
      const response = await this.client.post('/payments', {
        transaction_amount: request.amount,
        payment_method_id: this.mapPaymentMethod(request.method),
        payer: {
          email: request.metadata?.email,
        },
        description: request.description,
        external_reference: request.reference,
        token: request.cardToken,
        capture: false,
      });

      const payment = response.data;

      return {
        id: payment.id.toString(),
        transactionId: payment.id.toString(),
        status: PaymentStatus.Authorized,
        amount: request.amount,
        currency: 'BRL',
        method: request.method,
        provider: PaymentProvider.MercadoPago,
        message: 'Payment authorized',
      };
    } catch (error) {
      throw new Error(`Mercado Pago authorization error: ${error.response?.data?.message || error.message}`);
    }
  }

  async capturePayment(paymentId: string, amount?: number): Promise<IPaymentResponse> {
    try {
      const response = await this.client.put(`/payments/${paymentId}`, {
        capture: true,
        transaction_amount: amount,
      });

      const payment = response.data;

      return {
        id: payment.id.toString(),
        transactionId: payment.id.toString(),
        status: this.mapMercadoPagoStatus(payment.status),
        amount: payment.transaction_amount,
        currency: 'BRL',
        method: PaymentMethod.CreditCard,
        provider: PaymentProvider.MercadoPago,
        message: 'Payment captured',
      };
    } catch (error) {
      throw new Error(`Mercado Pago capture error: ${error.response?.data?.message || error.message}`);
    }
  }

  async refundPayment(request: IRefundRequest): Promise<IRefundResponse> {
    try {
      const response = await this.client.post(`/payments/${request.paymentId}/refunds`, {
        amount: request.amount,
      });

      const refund = response.data;

      return {
        id: refund.id.toString(),
        originalPaymentId: request.paymentId,
        transactionId: refund.id.toString(),
        status: PaymentStatus.Refunded,
        amount: refund.amount,
        message: 'Refund processed',
      };
    } catch (error) {
      throw new Error(`Mercado Pago refund error: ${error.response?.data?.message || error.message}`);
    }
  }

  async validateWebhook(payload: IWebhookPayload): Promise<boolean> {
    try {
      // Validar assinatura do webhook
      // Implementar validação específica do Mercado Pago
      return true;
    } catch (error) {
      return false;
    }
  }

  async processWebhook(payload: IWebhookPayload): Promise<any> {
    const { type, data } = payload;

    switch (type) {
      case 'payment':
        return {
          status: this.mapMercadoPagoStatus(data.status),
          transactionId: data.id.toString(),
        };

      case 'refund':
        return {
          status: PaymentStatus.Refunded,
          transactionId: data.id.toString(),
        };

      default:
        return null;
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const response = await this.client.get(`/payments/${transactionId}`);
      return this.mapMercadoPagoStatus(response.data.status);
    } catch (error) {
      throw new Error(`Mercado Pago status check error: ${error.message}`);
    }
  }

  async tokenizeCard(cardData: any): Promise<string> {
    try {
      const response = await this.client.post('/card_tokens', {
        cardNumber: cardData.number,
        cardholderName: cardData.holderName,
        cardExpirationMonth: cardData.expMonth,
        cardExpirationYear: cardData.expYear,
        securityCode: cardData.cvc,
      });

      return response.data.id;
    } catch (error) {
      throw new Error(`Mercado Pago tokenization error: ${error.message}`);
    }
  }

  private mapPaymentMethod(method: PaymentMethod): string {
    const methodMap: Record<PaymentMethod, string> = {
      [PaymentMethod.CreditCard]: 'credit_card',
      [PaymentMethod.DebitCard]: 'debit_card',
      [PaymentMethod.Pix]: 'pix',
      [PaymentMethod.BankTransfer]: 'bank_transfer',
      [PaymentMethod.Boleto]: 'boleto',
      [PaymentMethod.PayPal]: 'paypal',
      [PaymentMethod.Cash]: 'cash',
    };

    return methodMap[method] || 'credit_card';
  }

  private mapMercadoPagoStatus(mpStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      pending: PaymentStatus.Pending,
      approved: PaymentStatus.Captured,
      authorized: PaymentStatus.Authorized,
      in_process: PaymentStatus.Processing,
      in_mediation: PaymentStatus.Processing,
      rejected: PaymentStatus.Failed,
      cancelled: PaymentStatus.Cancelled,
      refunded: PaymentStatus.Refunded,
      charged_back: PaymentStatus.Failed,
    };

    return statusMap[mpStatus] || PaymentStatus.Pending;
  }
}
