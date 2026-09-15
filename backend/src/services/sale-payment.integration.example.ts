/**
 * EXEMPLO DE INTEGRAÇÃO: Sale + Payment
 * 
 * Este arquivo mostra como integrar o sistema de pagamento
 * com o serviço de vendas (Sale).
 */

import { DataSource } from 'typeorm';
import { SaleService } from './sale.service';
import { PaymentService } from './payment.service';
import { Sale, SaleStatus, SalePaymentStatus } from '../entities/tenant/Sale';
import { Payment, PaymentStatus, PaymentMethod, PaymentProvider } from '../entities/tenant/Payment';

/**
 * Serviço integrado de vendas com pagamento
 */
export class SalePaymentService {
  private saleService: SaleService;
  private paymentService: PaymentService;

  constructor(private dataSource: DataSource) {
    this.saleService = new SaleService(this.dataSource);
    this.paymentService = new PaymentService(this.dataSource);
  }

  /**
   * Processa uma venda com pagamento
   * 
   * Fluxo:
   * 1. Validar venda
   * 2. Processar pagamento
   * 3. Atualizar status da venda
   * 4. Registrar transação
   */
  async processSaleWithPayment(
    saleId: string,
    amount: number,
    method: PaymentMethod,
    provider: PaymentProvider,
    cardToken?: string,
    metadata?: Record<string, any>
  ): Promise<{ sale: Sale; payment: Payment }> {
    try {
      // 1. Obter venda
      const sale = await this.saleService.getSaleById(saleId);
      if (!sale) {
        throw new Error('Sale not found');
      }

      // 2. Validar status da venda
      if (sale.status !== SaleStatus.Open) {
        throw new Error('Sale is not open for payment');
      }

      // 3. Validar valor
      if (amount > sale.total) {
        throw new Error('Payment amount exceeds sale total');
      }

      // 4. Processar pagamento
      const payment = await this.paymentService.processPayment(
        saleId,
        null,
        amount,
        method,
        provider,
        cardToken,
        metadata
      );

      // 5. Atualizar status da venda baseado no pagamento
      if (payment.status === PaymentStatus.Captured) {
        // Pagamento bem-sucedido
        const newPaymentStatus = amount >= sale.total 
          ? SalePaymentStatus.Paid 
          : SalePaymentStatus.PartiallyPaid;

        await this.saleService.updateSale(saleId, {
          paymentStatus: newPaymentStatus,
          amountPaid: (sale.amountPaid || 0) + amount,
          status: amount >= sale.total ? SaleStatus.Completed : SaleStatus.Open,
        });

        // Recarregar venda atualizada
        const updatedSale = await this.saleService.getSaleById(saleId);

        return {
          sale: updatedSale!,
          payment,
        };
      } else if (payment.status === PaymentStatus.Failed) {
        // Pagamento falhou
        throw new Error(`Payment failed: ${payment.metadata?.errorMessage || 'Unknown error'}`);
      } else {
        // Pagamento em processamento
        return {
          sale,
          payment,
        };
      }
    } catch (error) {
      throw new Error(`Sale payment processing failed: ${error.message}`);
    }
  }

  /**
   * Autoriza um pagamento para uma venda
   * (sem capturar imediatamente)
   */
  async authorizeSalePayment(
    saleId: string,
    amount: number,
    method: PaymentMethod,
    provider: PaymentProvider,
    cardToken?: string
  ): Promise<Payment> {
    try {
      const sale = await this.saleService.getSaleById(saleId);
      if (!sale) {
        throw new Error('Sale not found');
      }

      const payment = await this.paymentService.authorizePayment(
        saleId,
        null,
        amount,
        method,
        provider,
        cardToken
      );

      // Atualizar status da venda para "aguardando captura"
      await this.saleService.updateSale(saleId, {
        paymentStatus: SalePaymentStatus.Pending,
      });

      return payment;
    } catch (error) {
      throw new Error(`Sale payment authorization failed: ${error.message}`);
    }
  }

  /**
   * Captura um pagamento autorizado
   */
  async captureSalePayment(
    saleId: string,
    paymentId: string,
    amount?: number
  ): Promise<{ sale: Sale; payment: Payment }> {
    try {
      const sale = await this.saleService.getSaleById(saleId);
      if (!sale) {
        throw new Error('Sale not found');
      }

      const payment = await this.paymentService.capturePayment(paymentId, amount);

      if (payment.status === PaymentStatus.Captured) {
        const newPaymentStatus = payment.amountPaid >= sale.total
          ? SalePaymentStatus.Paid
          : SalePaymentStatus.PartiallyPaid;

        await this.saleService.updateSale(saleId, {
          paymentStatus: newPaymentStatus,
          amountPaid: (sale.amountPaid || 0) + (amount || sale.total),
          status: payment.amountPaid >= sale.total ? SaleStatus.Completed : SaleStatus.Open,
        });

        const updatedSale = await this.saleService.getSaleById(saleId);

        return {
          sale: updatedSale!,
          payment,
        };
      }

      return {
        sale,
        payment,
      };
    } catch (error) {
      throw new Error(`Sale payment capture failed: ${error.message}`);
    }
  }

  /**
   * Reembolsa um pagamento de venda
   */
  async refundSalePayment(
    saleId: string,
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<{ sale: Sale; payment: Payment }> {
    try {
      const sale = await this.saleService.getSaleById(saleId);
      if (!sale) {
        throw new Error('Sale not found');
      }

      const payment = await this.paymentService.refundPayment(paymentId, amount, reason);

      if (payment.status === PaymentStatus.Refunded) {
        // Atualizar status da venda
        const newAmountPaid = Math.max(0, (sale.amountPaid || 0) - (amount || sale.total));
        const newPaymentStatus = newAmountPaid === 0
          ? SalePaymentStatus.Pending
          : newAmountPaid >= sale.total
          ? SalePaymentStatus.Paid
          : SalePaymentStatus.PartiallyPaid;

        await this.saleService.updateSale(saleId, {
          paymentStatus: newPaymentStatus,
          amountPaid: newAmountPaid,
          status: newAmountPaid === 0 ? SaleStatus.Open : SaleStatus.Completed,
        });

        const updatedSale = await this.saleService.getSaleById(saleId);

        return {
          sale: updatedSale!,
          payment,
        };
      }

      return {
        sale,
        payment,
      };
    } catch (error) {
      throw new Error(`Sale payment refund failed: ${error.message}`);
    }
  }

  /**
   * Obtém histórico de pagamentos de uma venda
   */
  async getSalePaymentHistory(saleId: string): Promise<Payment[]> {
    return this.paymentService.getPaymentsBySaleId(saleId);
  }

  /**
   * Calcula o saldo pendente de uma venda
   */
  async calculateSaleBalance(saleId: string): Promise<number> {
    const sale = await this.saleService.getSaleById(saleId);
    if (!sale) {
      throw new Error('Sale not found');
    }

    const amountPaid = sale.amountPaid || 0;
    return Math.max(0, sale.total - amountPaid);
  }

  /**
   * Verifica se uma venda está totalmente paga
   */
  async isSaleFullyPaid(saleId: string): Promise<boolean> {
    const balance = await this.calculateSaleBalance(saleId);
    return balance === 0;
  }

  /**
   * Processa pagamento parcial de uma venda
   */
  async processPartialPayment(
    saleId: string,
    amount: number,
    method: PaymentMethod,
    provider: PaymentProvider,
    cardToken?: string
  ): Promise<{ sale: Sale; payment: Payment; remainingBalance: number }> {
    const { sale, payment } = await this.processSaleWithPayment(
      saleId,
      amount,
      method,
      provider,
      cardToken
    );

    const remainingBalance = await this.calculateSaleBalance(saleId);

    return {
      sale,
      payment,
      remainingBalance,
    };
  }

  /**
   * Processa pagamento com múltiplos métodos
   * (ex: parte em cartão, parte em dinheiro)
   */
  async processMultiMethodPayment(
    saleId: string,
    payments: Array<{
      amount: number;
      method: PaymentMethod;
      provider: PaymentProvider;
      cardToken?: string;
    }>
  ): Promise<{ sale: Sale; payments: Payment[] }> {
    try {
      const sale = await this.saleService.getSaleById(saleId);
      if (!sale) {
        throw new Error('Sale not found');
      }

      const processedPayments: Payment[] = [];
      let totalAmount = 0;

      for (const paymentData of payments) {
        const payment = await this.paymentService.processPayment(
          saleId,
          null,
          paymentData.amount,
          paymentData.method,
          paymentData.provider,
          paymentData.cardToken
        );

        if (payment.status === PaymentStatus.Captured) {
          processedPayments.push(payment);
          totalAmount += paymentData.amount;
        } else {
          throw new Error(`Payment with ${paymentData.method} failed`);
        }
      }

      // Atualizar status da venda
      const newPaymentStatus = totalAmount >= sale.total
        ? SalePaymentStatus.Paid
        : SalePaymentStatus.PartiallyPaid;

      await this.saleService.updateSale(saleId, {
        paymentStatus: newPaymentStatus,
        amountPaid: (sale.amountPaid || 0) + totalAmount,
        status: totalAmount >= sale.total ? SaleStatus.Completed : SaleStatus.Open,
      });

      const updatedSale = await this.saleService.getSaleById(saleId);

      return {
        sale: updatedSale!,
        payments: processedPayments,
      };
    } catch (error) {
      throw new Error(`Multi-method payment processing failed: ${error.message}`);
    }
  }
}

/**
 * EXEMPLO DE USO:
 * 
 * const salePaymentService = new SalePaymentService(dataSource);
 * 
 * // 1. Processar pagamento completo
 * const { sale, payment } = await salePaymentService.processSaleWithPayment(
 *   'sale-uuid',
 *   150.50,
 *   PaymentMethod.CreditCard,
 *   PaymentProvider.Stripe,
 *   'tok_visa'
 * );
 * 
 * // 2. Processar pagamento parcial
 * const { sale, payment, remainingBalance } = await salePaymentService.processPartialPayment(
 *   'sale-uuid',
 *   50.00,
 *   PaymentMethod.CreditCard,
 *   PaymentProvider.Stripe,
 *   'tok_visa'
 * );
 * 
 * // 3. Processar com múltiplos métodos
 * const { sale, payments } = await salePaymentService.processMultiMethodPayment(
 *   'sale-uuid',
 *   [
 *     {
 *       amount: 100.00,
 *       method: PaymentMethod.CreditCard,
 *       provider: PaymentProvider.Stripe,
 *       cardToken: 'tok_visa'
 *     },
 *     {
 *       amount: 50.50,
 *       method: PaymentMethod.Pix,
 *       provider: PaymentProvider.MercadoPago
 *     }
 *   ]
 * );
 * 
 * // 4. Reembolsar
 * const { sale, payment } = await salePaymentService.refundSalePayment(
 *   'sale-uuid',
 *   'payment-uuid',
 *   50.00,
 *   'customer_request'
 * );
 * 
 * // 5. Obter histórico
 * const payments = await salePaymentService.getSalePaymentHistory('sale-uuid');
 * 
 * // 6. Calcular saldo
 * const balance = await salePaymentService.calculateSaleBalance('sale-uuid');
 * 
 * // 7. Verificar se está pago
 * const isPaid = await salePaymentService.isSaleFullyPaid('sale-uuid');
 */
