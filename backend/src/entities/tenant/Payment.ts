import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sale } from './Sale';
import { Order } from './Order';
import { User } from './User';
import { PaymentTransaction } from './PaymentTransaction';

export enum PaymentStatus {
  Pending = 'pending',
  Processing = 'processing',
  Authorized = 'authorized',
  Captured = 'captured',
  Failed = 'failed',
  Cancelled = 'cancelled',
  Refunded = 'refunded',
}

export enum PaymentMethod {
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
  Pix = 'pix',
  BankTransfer = 'bank_transfer',
  Boleto = 'boleto',
  PayPal = 'paypal',
  Cash = 'cash',
}

export enum PaymentProvider {
  Stripe = 'stripe',
  PayPal = 'paypal',
  MercadoPago = 'mercado_pago',
  Manual = 'manual',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentProvider })
  provider: PaymentProvider;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amountPaid: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amountRefunded: number;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  // Referência ao provedor de pagamento
  @Column({ type: 'varchar', nullable: true })
  providerTransactionId: string | null;

  // Referência interna
  @Column({ type: 'varchar', nullable: true })
  reference: string | null;

  // Relacionamentos
  @ManyToOne(() => Sale, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale | null;

  @Column({ name: 'sale_id', type: 'uuid', nullable: true })
  saleId: string | null;

  @ManyToOne(() => Order, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;

  @Column({ name: 'order_id', type: 'integer', nullable: true })
  orderId: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User | null;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById: string | null;

  @OneToMany(() => PaymentTransaction, (transaction) => transaction.payment, { cascade: true })
  transactions: PaymentTransaction[];

  // Metadados
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  // Datas
  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
