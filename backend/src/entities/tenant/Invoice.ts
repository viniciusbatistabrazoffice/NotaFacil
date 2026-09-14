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

export enum InvoiceStatus {
  Issued = 'issued',
  Cancelled = 'cancelled',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: string;

  @Column({ name: 'client_name' })
  clientName: string;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.Issued })
  status: InvoiceStatus;

  @Column({ type: 'date' })
  issueDate: string;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => Order, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;

  @Column({ name: 'order_id', nullable: true })
  orderId: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
