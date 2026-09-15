import Stripe from 'stripe';
import {
  IPaymentGateway,
  IPaymentRequest,
  IPaymentResponse,
  IRefundRequest,
  IRefundResponse,
  IWebhookPayload,
} from '../interfaces/IPaymentGateway';
import { PaymentStatus, PaymentProvider, PaymentMethod } from '../../entities/tenant/Payment';

export class StripeGateway implements IPaymentGateway {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async processPayment(request: IPaymentRequest): Promise<IPaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(request.amount * 100), // Stripe usa centavos
        currency: request.currency.toLowerCase(),
        payment_method: request.cardToken,
        confirm: true,
        description: request.description,
        metadata: {
          reference: request.reference,
          ...request.metadata,
        },
        idempotency_key: request.idempotencyKey,
      });

      return {
        id: paymentIntent.id,
        transactionId: paymentIntent.id,
        status: this.mapStripeStatus(paymentIntent.status),
        amount: request.amount,
        currency: request.currency,
        method: request.method,
        provider: PaymentProvider.Stripe,
        authorizationCode: paymentIntent.charges.data[0]?.id,
        message: 'Payment processed successfully',
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      throw new Error(`Stripe payment error: ${error.message}`);
    }
  }

  async authorizePayment(request: IPaymentRequest): Promise<IPaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(request.amount * 100),
        currency: request.currency.toLowerCase(),
        payment_method: request.cardToken,
        confirm: false,
        description: request.description,
        metadata: {
          reference: request.reference,
          ...request.metadata,
        },
      });

      return {
        id: paymentIntent.id,
        transactionId: paymentIntent.id,
        status: PaymentStatus.Authorized,
        amount: request.amount,
        currency: request.currency,
        method: request.method,
        provider: PaymentProvider.Stripe,
        message: 'Payment authorized',
      };
    } catch (error) {
      throw new Error(`Stripe authorization error: ${error.message}`);
    }
  }

  async capturePayment(paymentId: string, amount?: number): Promise<IPaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentId);

      return {
        id: paymentIntent.id,
        transactionId: paymentIntent.id,
        status: this.mapStripeStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        method: PaymentMethod.CreditCard,
        provider: PaymentProvider.Stripe,
        message: 'Payment captured',
      };
    } catch (error) {
      throw new Error(`Stripe capture error: ${error.message}`);
    }
  }

  async refundPayment(request: IRefundRequest): Promise<IRefundResponse> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: request.paymentId,
        amount: request.amount ? Math.round(request.amount * 100) : undefined,
        reason: request.reason as any,
        metadata: request.metadata,
      });

      return {
        id: refund.id,
        originalPaymentId: request.paymentId,
        transactionId: refund.id,
        status: refund.status === 'succeeded' ? PaymentStatus.Refunded : PaymentStatus.Failed,
        amount: refund.amount / 100,
        message: `Refund ${refund.status}`,
      };
    } catch (error) {
      throw new Error(`Stripe refund error: ${error.message}`);
    }
  }

  async validateWebhook(payload: IWebhookPayload): Promise<boolean> {
    try {
      // Implementar validação de assinatura Stripe
      // Normalmente feito com webhook secret
      return true;
    } catch (error) {
      return false;
    }
  }

  async processWebhook(payload: IWebhookPayload): Promise<any> {
    const { type, data } = payload;

    switch (type) {
      case 'payment_intent.succeeded':
        return {
          status: PaymentStatus.Captured,
          transactionId: data.object.id,
        };

      case 'payment_intent.payment_failed':
        return {
          status: PaymentStatus.Failed,
          transactionId: data.object.id,
          error: data.object.last_payment_error?.message,
        };

      case 'charge.refunded':
        return {
          status: PaymentStatus.Refunded,
          transactionId: data.object.payment_intent,
        };

      default:
        return null;
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);
      return this.mapStripeStatus(paymentIntent.status);
    } catch (error) {
      throw new Error(`Stripe status check error: ${error.message}`);
    }
  }

  async tokenizeCard(cardData: any): Promise<string> {
    try {
      const token = await this.stripe.tokens.create({
        card: {
          number: cardData.number,
          exp_month: cardData.expMonth,
          exp_year: cardData.expYear,
          cvc: cardData.cvc,
        },
      });

      return token.id;
    } catch (error) {
      throw new Error(`Stripe tokenization error: ${error.message}`);
    }
  }

  private mapStripeStatus(stripeStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      requires_payment_method: PaymentStatus.Pending,
      requires_confirmation: PaymentStatus.Pending,
      requires_action: PaymentStatus.Processing,
      processing: PaymentStatus.Processing,
      requires_capture: PaymentStatus.Authorized,
      succeeded: PaymentStatus.Captured,
      canceled: PaymentStatus.Cancelled,
    };

    return statusMap[stripeStatus] || PaymentStatus.Pending;
  }
}
