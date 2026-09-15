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

export class PayPalGateway implements IPaymentGateway {
  private client: AxiosInstance;
  private clientId: string;
  private clientSecret: string;
  private baseURL: string;

  constructor(clientId: string, clientSecret: string, sandbox: boolean = true) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseURL = sandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

    this.client = axios.create({
      baseURL: this.baseURL,
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });
  }

  async processPayment(request: IPaymentRequest): Promise<IPaymentResponse> {
    try {
      // Obter access token
      const token = await this.getAccessToken();

      // Criar ordem
      const orderResponse = await axios.post(
        `${this.baseURL}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: request.currency,
                value: request.amount.toString(),
              },
              description: request.description,
              reference_id: request.reference,
            },
          ],
          payment_source: {
            card: {
              number: request.metadata?.cardNumber,
              expiry: request.metadata?.cardExpiry,
              security_code: request.metadata?.cardCvc,
              name: {
                given_name: request.metadata?.firstName,
                surname: request.metadata?.lastName,
              },
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const order = orderResponse.data;

      return {
        id: order.id,
        transactionId: order.id,
        status: this.mapPayPalStatus(order.status),
        amount: request.amount,
        currency: request.currency,
        method: request.method,
        provider: PaymentProvider.PayPal,
        message: order.status,
        metadata: {
          orderId: order.id,
          payer: order.payer,
        },
      };
    } catch (error) {
      throw new Error(`PayPal payment error: ${error.response?.data?.message || error.message}`);
    }
  }

  async authorizePayment(request: IPaymentRequest): Promise<IPaymentResponse> {
    try {
      const token = await this.getAccessToken();

      const orderResponse = await axios.post(
        `${this.baseURL}/v2/checkout/orders`,
        {
          intent: 'AUTHORIZE',
          purchase_units: [
            {
              amount: {
                currency_code: request.currency,
                value: request.amount.toString(),
              },
              description: request.description,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const order = orderResponse.data;

      return {
        id: order.id,
        transactionId: order.id,
        status: PaymentStatus.Authorized,
        amount: request.amount,
        currency: request.currency,
        method: request.method,
        provider: PaymentProvider.PayPal,
        message: 'Payment authorized',
      };
    } catch (error) {
      throw new Error(`PayPal authorization error: ${error.message}`);
    }
  }

  async capturePayment(paymentId: string, amount?: number): Promise<IPaymentResponse> {
    try {
      const token = await this.getAccessToken();

      const captureResponse = await axios.post(
        `${this.baseURL}/v2/checkout/orders/${paymentId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const order = captureResponse.data;

      return {
        id: order.id,
        transactionId: order.id,
        status: this.mapPayPalStatus(order.status),
        amount: order.purchase_units[0].amount.value,
        currency: order.purchase_units[0].amount.currency_code,
        method: PaymentMethod.PayPal,
        provider: PaymentProvider.PayPal,
        message: 'Payment captured',
      };
    } catch (error) {
      throw new Error(`PayPal capture error: ${error.message}`);
    }
  }

  async refundPayment(request: IRefundRequest): Promise<IRefundResponse> {
    try {
      const token = await this.getAccessToken();

      // Obter detalhes da ordem para encontrar a captura
      const orderResponse = await axios.get(
        `${this.baseURL}/v2/checkout/orders/${request.paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const captureId = orderResponse.data.purchase_units[0].payments.captures[0].id;

      // Reembolsar a captura
      const refundResponse = await axios.post(
        `${this.baseURL}/v2/payments/captures/${captureId}/refund`,
        {
          amount: {
            value: request.amount?.toString(),
            currency_code: 'BRL',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const refund = refundResponse.data;

      return {
        id: refund.id,
        originalPaymentId: request.paymentId,
        transactionId: refund.id,
        status: PaymentStatus.Refunded,
        amount: parseFloat(refund.amount.value),
        message: 'Refund processed',
      };
    } catch (error) {
      throw new Error(`PayPal refund error: ${error.message}`);
    }
  }

  async validateWebhook(payload: IWebhookPayload): Promise<boolean> {
    try {
      // Implementar validação de assinatura PayPal
      return true;
    } catch (error) {
      return false;
    }
  }

  async processWebhook(payload: IWebhookPayload): Promise<any> {
    const { type, data } = payload;

    switch (type) {
      case 'CHECKOUT.ORDER.COMPLETED':
        return {
          status: PaymentStatus.Captured,
          transactionId: data.id,
        };

      case 'CHECKOUT.ORDER.APPROVED':
        return {
          status: PaymentStatus.Authorized,
          transactionId: data.id,
        };

      case 'PAYMENT.CAPTURE.REFUNDED':
        return {
          status: PaymentStatus.Refunded,
          transactionId: data.id,
        };

      default:
        return null;
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseURL}/v2/checkout/orders/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return this.mapPayPalStatus(response.data.status);
    } catch (error) {
      throw new Error(`PayPal status check error: ${error.message}`);
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseURL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error(`PayPal token error: ${error.message}`);
    }
  }

  private mapPayPalStatus(paypalStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      CREATED: PaymentStatus.Pending,
      SAVED: PaymentStatus.Pending,
      APPROVED: PaymentStatus.Authorized,
      VOIDED: PaymentStatus.Cancelled,
      COMPLETED: PaymentStatus.Captured,
      PAYER_ACTION_REQUIRED: PaymentStatus.Processing,
    };

    return statusMap[paypalStatus] || PaymentStatus.Pending;
  }
}
