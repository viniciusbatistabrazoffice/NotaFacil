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

export enum ProductionStage {
  Cutting = 'cutting',
  Sewing = 'sewing',
  Finishing = 'finishing',
  Packaging = 'packaging',
  Done = 'done',
}

@Entity('productions')
export class Production {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product: string;

  @Column()
  client: string;

  @Column({ type: 'enum', enum: ProductionStage, default: ProductionStage.Cutting })
  stage: ProductionStage;

  @Column('integer', { default: 0 })
  progress: number;

  @Column({ type: 'date' })
  dueDate: string;

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
