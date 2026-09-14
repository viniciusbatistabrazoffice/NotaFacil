import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './Order';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'reset_token', type: 'varchar', nullable: true, select: false })
  resetToken: string | null;

  @Column({ name: 'reset_token_expires', type: 'timestamptz', nullable: true, select: false })
  resetTokenExpires: Date | null;

  @OneToMany(() => Order, (order) => order.createdBy)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
