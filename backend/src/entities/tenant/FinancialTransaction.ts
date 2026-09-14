import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './Order';
import { User } from './User';

const decimalToNumber = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value == null ? null : Number(value)),
};

export enum FinancialTransactionType {
  Income = 'income',
  Expense = 'expense',
}

export enum FinancialTransactionStatus {
  Pending = 'pending',
  Settled = 'settled',
  Cancelled = 'cancelled',
}

export enum PaymentMethod {
  Cash = 'cash',
  CreditCard = 'credit_card',
  DebitCard = 'debit_card',
  BankTransfer = 'bank_transfer',
  Pix = 'pix',
  Check = 'check',
  Other = 'other',
}

@Entity('financial_transactions')
export class FinancialTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ type: 'enum', enum: FinancialTransactionType })
  type: FinancialTransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2, transformer: decimalToNumber })
  amount: number;

  @Column({ type: 'enum', enum: FinancialTransactionStatus, default: FinancialTransactionStatus.Pending })
  status: FinancialTransactionStatus;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ name: 'settled_at', type: 'timestamptz', nullable: true })
  settledAt: Date | null;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod | null;

  @ManyToOne(() => Order, (order) => order.financialTransactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}