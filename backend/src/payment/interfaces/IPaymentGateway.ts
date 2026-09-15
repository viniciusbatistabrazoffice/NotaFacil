import { PaymentMethod, PaymentProvider, PaymentStatus } from '../../entities/tenant/Payment';

export interface IPaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  description?: string;
  reference?: string;
  metadata?: Record<string, any>;
  cardToken?: string;
  customerId?: string;
  idempotencyKey?: string;
}

export interface IPaymentResponse {
  id: string;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  authorizationCode?: string;
  message?: string;
  metadata?: Record<string, any>;
}

export interface IRefundRequest {
  paymentId: string;
  amount?: number; // Se não informado, reembolsa o valor total
  reason?: string;
  metadata?: Record<string, any>;
}

export interface IRefundResponse {
  id: string;
  originalPaymentId: string;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  message?: string;
}

export interface IWebhookPayload {
  provider: PaymentProvider;
  type: string;
  data: Record<string, any>;
  signature?: string;
}

export interface IPaymentGateway {
  /**
   * Processa um pagamento
   */
  processPayment(request: IPaymentRequest): Promise<IPaymentResponse>;

  /**
   * Autoriza um pagamento sem capturar
   */
  authorizePayment(request: IPaymentRequest): Promise<IPaymentResponse>;

  /**
   * Captura um pagamento autorizado
   */
  capturePayment(paymentId: string, amount?: number): Promise<IPaymentResponse>;

  /**
   * Reembolsa um pagamento
   */
  refundPayment(request: IRefundRequest): Promise<IRefundResponse>;

  /**
   * Valida um webhook
   */
  validateWebhook(payload: IWebhookPayload): Promise<boolean>;

  /**
   * Processa um webhook
   */
  processWebhook(payload: IWebhookPayload): Promise<any>;

  /**
   * Obtém o status de um pagamento
   */
  getPaymentStatus(transactionId: string): Promise<PaymentStatus>;

  /**
   * Tokeniza um cartão para uso futuro
   */
  tokenizeCard?(cardData: any): Promise<string>;
}
