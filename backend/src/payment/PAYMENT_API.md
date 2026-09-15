# 💳 Payment Gateway API Documentation

## Overview

NotaFacil integrates with multiple payment providers to process payments securely. Supported providers include:
- **Stripe** - Credit/Debit cards
- **Mercado Pago** - Multiple payment methods (cards, Pix, Boleto)
- **PayPal** - PayPal accounts and cards

---

## Endpoints

### 1. Process Payment
**POST** `/api/payments`

Process a payment immediately.

#### Request Body
```json
{
  "saleId": "uuid-of-sale",
  "orderId": null,
  "amount": 150.50,
  "method": "credit_card",
  "provider": "stripe",
  "cardToken": "tok_visa",
  "metadata": {
    "email": "customer@example.com",
    "installments": 3
  }
}
```

#### Response (201 Created)
```json
{
  "id": "payment-uuid",
  "status": "captured",
  "method": "credit_card",
  "provider": "stripe",
  "amount": 150.50,
  "amountPaid": 150.50,
  "providerTransactionId": "pi_1234567890",
  "paidAt": "2026-09-15T10:30:00Z",
  "transactions": [
    {
      "id": "transaction-uuid",
      "type": "capture",
      "status": "success",
      "amount": 150.50,
      "authorizationCode": "ch_1234567890"
    }
  ]
}
```

---

### 2. Authorize Payment
**POST** `/api/payments/authorize`

Authorize a payment without capturing (useful for 2-step payments).

#### Request Body
```json
{
  "saleId": "uuid-of-sale",
  "amount": 150.50,
  "method": "credit_card",
  "provider": "stripe",
  "cardToken": "tok_visa"
}
```

#### Response (201 Created)
```json
{
  "id": "payment-uuid",
  "status": "authorized",
  "amount": 150.50,
  "providerTransactionId": "pi_1234567890"
}
```

---

### 3. Capture Payment
**POST** `/api/payments/:id/capture`

Capture a previously authorized payment.

#### Request Body
```json
{
  "amount": 150.50
}
```

#### Response (200 OK)
```json
{
  "id": "payment-uuid",
  "status": "captured",
  "amountPaid": 150.50,
  "paidAt": "2026-09-15T10:30:00Z"
}
```

---

### 4. Refund Payment
**POST** `/api/payments/:id/refund`

Refund a captured payment (full or partial).

#### Request Body
```json
{
  "amount": 50.00,
  "reason": "customer_request"
}
```

#### Response (200 OK)
```json
{
  "id": "payment-uuid",
  "status": "refunded",
  "amountRefunded": 50.00,
  "refundedAt": "2026-09-15T10:35:00Z"
}
```

---

### 5. Get Payment Details
**GET** `/api/payments/:id`

Retrieve payment details and transaction history.

#### Response (200 OK)
```json
{
  "id": "payment-uuid",
  "status": "captured",
  "method": "credit_card",
  "provider": "stripe",
  "amount": 150.50,
  "amountPaid": 150.50,
  "amountRefunded": 0,
  "saleId": "sale-uuid",
  "orderId": null,
  "transactions": [
    {
      "id": "transaction-uuid",
      "type": "capture",
      "status": "success",
      "amount": 150.50,
      "authorizationCode": "ch_1234567890",
      "createdAt": "2026-09-15T10:30:00Z"
    }
  ],
  "createdAt": "2026-09-15T10:30:00Z",
  "paidAt": "2026-09-15T10:30:00Z"
}
```

---

### 6. Get Payment Status
**GET** `/api/payments/:id/status`

Check the current status of a payment.

#### Response (200 OK)
```json
{
  "id": "payment-uuid",
  "status": "captured"
}
```

---

### 7. Get Payments by Sale
**GET** `/api/payments/sale/:saleId`

Retrieve all payments for a specific sale.

#### Response (200 OK)
```json
[
  {
    "id": "payment-uuid-1",
    "status": "captured",
    "amount": 100.00,
    "method": "credit_card",
    "provider": "stripe",
    "createdAt": "2026-09-15T10:30:00Z"
  },
  {
    "id": "payment-uuid-2",
    "status": "captured",
    "amount": 50.50,
    "method": "pix",
    "provider": "mercado_pago",
    "createdAt": "2026-09-15T10:35:00Z"
  }
]
```

---

### 8. Get Payments by Order
**GET** `/api/payments/order/:orderId`

Retrieve all payments for a specific order.

#### Response (200 OK)
```json
[
  {
    "id": "payment-uuid",
    "status": "captured",
    "amount": 150.50,
    "method": "credit_card",
    "provider": "stripe"
  }
]
```

---

### 9. Get Payment Statistics
**GET** `/api/payments/stats?startDate=2026-01-01&endDate=2026-12-31`

Get payment statistics for a date range.

#### Response (200 OK)
```json
[
  {
    "status": "captured",
    "count": 150,
    "total": 15000.50
  },
  {
    "status": "failed",
    "count": 5,
    "total": 500.00
  },
  {
    "status": "refunded",
    "count": 10,
    "total": 1000.00
  }
]
```

---

### 10. Get Available Providers
**GET** `/api/payments/providers`

Get list of configured payment providers.

#### Response (200 OK)
```json
{
  "providers": ["stripe", "mercado_pago", "paypal"]
}
```

---

### 11. Webhook Handler
**POST** `/api/payments/webhook/:provider`

Handle webhooks from payment providers (no authentication required).

#### Request Body (Stripe Example)
```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "status": "succeeded",
      "amount": 15050,
      "currency": "brl"
    }
  }
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "result": {
    "status": "captured",
    "transactionId": "pi_1234567890"
  }
}
```

---

## Payment Methods

### Supported Payment Methods
```typescript
enum PaymentMethod {
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
  Pix = 'pix',
  BankTransfer = 'bank_transfer',
  Boleto = 'boleto',
  PayPal = 'paypal',
  Cash = 'cash',
}
```

---

## Payment Statuses

```typescript
enum PaymentStatus {
  Pending = 'pending',           // Aguardando processamento
  Processing = 'processing',     // Sendo processado
  Authorized = 'authorized',     // Autorizado, aguardando captura
  Captured = 'captured',         // Capturado com sucesso
  Failed = 'failed',             // Falha no processamento
  Cancelled = 'cancelled',       // Cancelado
  Refunded = 'refunded',         // Reembolsado
}
```

---

## Payment Providers Configuration

### Environment Variables

```bash
# Stripe
STRIPE_API_KEY=sk_test_...

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

---

## Examples

### Example 1: Process a Credit Card Payment

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "saleId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 150.50,
    "method": "credit_card",
    "provider": "stripe",
    "cardToken": "tok_visa",
    "metadata": {
      "email": "customer@example.com"
    }
  }'
```

### Example 2: Authorize and Capture Later

```bash
# Step 1: Authorize
curl -X POST http://localhost:3000/api/payments/authorize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "saleId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 150.50,
    "method": "credit_card",
    "provider": "stripe",
    "cardToken": "tok_visa"
  }'

# Step 2: Capture (use the payment ID from response)
curl -X POST http://localhost:3000/api/payments/PAYMENT_ID/capture \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.50
  }'
```

### Example 3: Process Pix Payment (Mercado Pago)

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "saleId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 150.50,
    "method": "pix",
    "provider": "mercado_pago",
    "metadata": {
      "email": "customer@example.com"
    }
  }'
```

### Example 4: Refund a Payment

```bash
curl -X POST http://localhost:3000/api/payments/PAYMENT_ID/refund \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "reason": "customer_request"
  }'
```

### Example 5: Get Payment Statistics

```bash
curl -X GET "http://localhost:3000/api/payments/stats?startDate=2026-01-01&endDate=2026-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Payment processing failed: Invalid card token"
}
```

### Common Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing required fields | Required parameters are missing |
| 400 | Invalid payment method | Payment method not supported |
| 400 | Payment not found | Payment ID doesn't exist |
| 400 | Payment is not authorized | Cannot capture non-authorized payment |
| 400 | Only captured payments can be refunded | Cannot refund non-captured payment |
| 400 | Refund amount exceeds paid amount | Refund amount is too high |
| 500 | Payment processing failed | Provider API error |

---

## Security Considerations

1. **PCI Compliance**: Never store raw card data. Always use tokenized cards.
2. **HTTPS**: All payment endpoints must use HTTPS in production.
3. **Authentication**: All endpoints (except webhooks) require JWT authentication.
4. **Webhook Validation**: Validate webhook signatures from payment providers.
5. **Idempotency**: Use idempotency keys to prevent duplicate charges.
6. **Rate Limiting**: Implement rate limiting on payment endpoints.

---

## Webhook Events

### Stripe Events
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Payment refunded

### Mercado Pago Events
- `payment` - Payment status change
- `refund` - Refund processed

### PayPal Events
- `CHECKOUT.ORDER.COMPLETED` - Order completed
- `CHECKOUT.ORDER.APPROVED` - Order approved
- `PAYMENT.CAPTURE.REFUNDED` - Payment refunded

---

## Best Practices

1. **Always use HTTPS** in production
2. **Store only transaction IDs**, not card details
3. **Implement retry logic** for failed payments
4. **Log all payment transactions** for audit purposes
5. **Monitor webhook delivery** and implement retry logic
6. **Use idempotency keys** to prevent duplicate charges
7. **Implement 3D Secure** for credit card payments
8. **Validate all input** before sending to payment providers

---

**Last Updated**: September 15, 2026
**Version**: 1.0
