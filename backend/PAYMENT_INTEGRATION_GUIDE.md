# 💳 Payment Gateway Integration Guide

## Overview

This guide explains how to integrate the NotaFacil payment gateway system into your application. The system supports multiple payment providers and handles complex payment scenarios.

---

## Table of Contents

1. [Setup](#setup)
2. [Configuration](#configuration)
3. [Integration Steps](#integration-steps)
4. [Frontend Integration](#frontend-integration)
5. [Webhook Setup](#webhook-setup)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install stripe paypal-rest-sdk axios
```

### 2. Create Payment Entities

The following entities are already created:
- `Payment` - Main payment record
- `PaymentTransaction` - Transaction history
- `PaymentMethod` - Saved payment methods

### 3. Update Database

Add migrations for payment tables:

```bash
npm run migration:generate -- -n AddPaymentTables
npm run migration:run
```

---

## Configuration

### 1. Environment Variables

Copy the example configuration:

```bash
cp .env.payment.example .env
```

Edit `.env` with your payment provider credentials:

```env
# Stripe
STRIPE_API_KEY=sk_test_...

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### 2. Update app.ts

Register the payment routes in your Express app:

```typescript
import { createRoutes } from './routes';

// In your Express setup
app.use('/api', createRoutes(dataSource));
```

---

## Integration Steps

### Step 1: Create a Payment Service Instance

```typescript
import { PaymentService } from './services/payment.service';
import { DataSource } from 'typeorm';

const paymentService = new PaymentService(dataSource);
```

### Step 2: Process a Payment

```typescript
import { PaymentMethod, PaymentProvider } from './entities/tenant/Payment';

const payment = await paymentService.processPayment(
  saleId,           // UUID of the sale
  null,             // orderId (null if using saleId)
  150.50,           // amount
  PaymentMethod.CreditCard,
  PaymentProvider.Stripe,
  'tok_visa',       // card token from frontend
  {
    email: 'customer@example.com',
    installments: 3
  }
);

console.log(payment.status); // 'captured' or 'failed'
```

### Step 3: Handle Payment Response

```typescript
if (payment.status === 'captured') {
  // Payment successful
  // Update sale/order status
  // Send confirmation email
} else if (payment.status === 'failed') {
  // Payment failed
  // Notify customer
  // Log error
}
```

### Step 4: Implement Refunds

```typescript
const refundedPayment = await paymentService.refundPayment(
  paymentId,
  50.00,  // partial refund
  'customer_request'
);
```

---

## Frontend Integration

### 1. Install Stripe.js (Example with Stripe)

```bash
npm install @stripe/react-stripe-js @stripe/js
```

### 2. Setup Stripe Provider

```javascript
import { loadStripe } from '@stripe/js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
```

### 3. Create Payment Form Component

```javascript
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentService } from '../services/paymentService';

export function PaymentForm({ saleId, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create payment method
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      // Process payment via backend
      const response = await paymentService.processPayment({
        saleId,
        amount,
        method: 'credit_card',
        provider: 'stripe',
        cardToken: paymentMethod.id,
      });

      if (response.status === 'captured') {
        // Payment successful
        alert('Payment successful!');
        // Redirect to confirmation page
      } else {
        alert('Payment failed: ' + response.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
}
```

### 4. Create Payment Service (Frontend)

```javascript
// src/services/paymentService.js
import api from './api';

export const paymentService = {
  async processPayment(data) {
    const response = await api.post('/payments', data);
    return response.data;
  },

  async authorizePayment(data) {
    const response = await api.post('/payments/authorize', data);
    return response.data;
  },

  async capturePayment(paymentId, amount) {
    const response = await api.post(`/payments/${paymentId}/capture`, { amount });
    return response.data;
  },

  async refundPayment(paymentId, amount, reason) {
    const response = await api.post(`/payments/${paymentId}/refund`, {
      amount,
      reason,
    });
    return response.data;
  },

  async getPaymentStatus(paymentId) {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  },

  async getPaymentsBySale(saleId) {
    const response = await api.get(`/payments/sale/${saleId}`);
    return response.data;
  },

  async getAvailableProviders() {
    const response = await api.get('/payments/providers');
    return response.data.providers;
  },
};
```

---

## Webhook Setup

### 1. Stripe Webhook Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/payments/webhook/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy webhook secret to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 2. Mercado Pago Webhook Setup

1. Go to [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel)
2. Add notification URL: `https://yourdomain.com/api/payments/webhook/mercado_pago`
3. Select events:
   - `payment`
   - `refund`

### 3. PayPal Webhook Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard)
2. Create webhook endpoint: `https://yourdomain.com/api/payments/webhook/paypal`
3. Select events:
   - `CHECKOUT.ORDER.COMPLETED`
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.REFUNDED`

### 4. Test Webhooks Locally

Use ngrok to expose your local server:

```bash
ngrok http 3000
```

Update webhook URLs with ngrok URL:
```
https://abc123.ngrok.io/api/payments/webhook/stripe
```

---

## Testing

### 1. Test Credit Card Numbers

#### Stripe
- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`
- Amex: `3782 822463 10005`

#### Mercado Pago
- Visa: `4111 1111 1111 1111`
- Mastercard: `5555 5555 5555 4444`

### 2. Test Payment Flow

```bash
# 1. Process payment
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "saleId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 10.00,
    "method": "credit_card",
    "provider": "stripe",
    "cardToken": "tok_visa"
  }'

# 2. Check payment status
curl -X GET http://localhost:3000/api/payments/PAYMENT_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Refund payment
curl -X POST http://localhost:3000/api/payments/PAYMENT_ID/refund \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5.00,
    "reason": "customer_request"
  }'
```

### 3. Run Unit Tests

```bash
npm test -- src/tests/payment.service.test.ts
```

---

## Troubleshooting

### Issue: "Payment provider not configured"

**Solution**: Check if API keys are set in `.env`:
```bash
echo $STRIPE_API_KEY
echo $MERCADO_PAGO_ACCESS_TOKEN
echo $PAYPAL_CLIENT_ID
```

### Issue: "Invalid card token"

**Solution**: Make sure you're using a valid test card number and the token is generated correctly by the payment provider's SDK.

### Issue: "Webhook signature validation failed"

**Solution**: 
1. Verify webhook secret is correct in `.env`
2. Check webhook is being sent from correct provider
3. Ensure request body is not modified before validation

### Issue: "Payment timeout"

**Solution**: Increase `PAYMENT_TIMEOUT_SECONDS` in `.env`:
```env
PAYMENT_TIMEOUT_SECONDS=600
```

### Issue: "Database connection error"

**Solution**: Ensure payment tables are created:
```bash
npm run migration:run
```

---

## Best Practices

1. **Always use HTTPS** in production
2. **Never log card details** - only log transaction IDs
3. **Implement idempotency** to prevent duplicate charges
4. **Validate all input** before sending to payment providers
5. **Monitor webhook delivery** and implement retry logic
6. **Use 3D Secure** for high-value transactions
7. **Implement rate limiting** on payment endpoints
8. **Log all payment events** for audit purposes

---

## Security Checklist

- [ ] API keys are stored in `.env` (not in code)
- [ ] HTTPS is enabled in production
- [ ] Webhook signatures are validated
- [ ] Card data is tokenized (never stored raw)
- [ ] PCI compliance is maintained
- [ ] Rate limiting is implemented
- [ ] Payment logs don't contain sensitive data
- [ ] Error messages don't expose sensitive information

---

## Support

For issues or questions:
1. Check the [Payment API Documentation](./src/payment/PAYMENT_API.md)
2. Review payment provider documentation:
   - [Stripe Docs](https://stripe.com/docs)
   - [Mercado Pago Docs](https://www.mercadopago.com.br/developers/docs)
   - [PayPal Docs](https://developer.paypal.com/docs)
3. Check application logs for error details

---

**Last Updated**: September 15, 2026
**Version**: 1.0
