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
import { SaleItem } from './SaleItem';
import { User } from './User';
import { Client } from './Client';

export enum SaleStatus {
  Open = 'open',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum SalePaymentStatus {
  Pending = 'pending',
  PartiallyPaid = 'partially_paid',
  Paid = 'paid',
}

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.Open })
  status: SaleStatus;

  @Column({ type: 'enum', enum: SalePaymentStatus, default: SalePaymentStatus.Pending })
  paymentStatus: SalePaymentStatus;

  @Column({ type: 'varchar', nullable: true })
  clientName: string | null;

  @ManyToOne(() => Client, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'client_id' })
  client: Client | null;

  @Column({ name: 'client_id', type: 'uuid', nullable: true })
  clientId: string | null;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amountPaid: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  change: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items: SaleItem[];

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User | null;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
