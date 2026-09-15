import { PaymentProvider } from '../entities/tenant/Payment';
import { IPaymentGateway } from './interfaces/IPaymentGateway';
import { StripeGateway } from './gateways/StripeGateway';
import { MercadoPagoGateway } from './gateways/MercadoPagoGateway';
import { PayPalGateway } from './gateways/PayPalGateway';

export class PaymentGatewayFactory {
  static createGateway(provider: PaymentProvider): IPaymentGateway {
    switch (provider) {
      case PaymentProvider.Stripe:
        return new StripeGateway(process.env.STRIPE_API_KEY || '');

      case PaymentProvider.MercadoPago:
        return new MercadoPagoGateway(process.env.MERCADO_PAGO_ACCESS_TOKEN || '');

      case PaymentProvider.PayPal:
        return new PayPalGateway(
          process.env.PAYPAL_CLIENT_ID || '',
          process.env.PAYPAL_CLIENT_SECRET || '',
          process.env.NODE_ENV !== 'production'
        );

      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  static getAvailableProviders(): PaymentProvider[] {
    const providers: PaymentProvider[] = [];

    if (process.env.STRIPE_API_KEY) {
      providers.push(PaymentProvider.Stripe);
    }

    if (process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      providers.push(PaymentProvider.MercadoPago);
    }

    if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
      providers.push(PaymentProvider.PayPal);
    }

    return providers;
  }
}
