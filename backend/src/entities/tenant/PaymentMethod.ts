import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

export enum CardBrand {
  Visa = 'visa',
  Mastercard = 'mastercard',
  AmericanExpress = 'amex',
  Elo = 'elo',
  Hipercard = 'hipercard',
}

@Entity('payment_methods')
export class PaymentMethodEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: string; // 'credit_card', 'debit_card', 'bank_account', 'wallet'

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  // Dados de cartão (criptografados)
  @Column({ type: 'varchar', nullable: true })
  cardToken: string | null; // Token do provedor

  @Column({ type: 'varchar', nullable: true })
  cardBrand: CardBrand | null;

  @Column({ type: 'varchar', nullable: true })
  cardLastFour: string | null; // Últimos 4 dígitos

  @Column({ type: 'varchar', nullable: true })
  cardHolderName: string | null;

  @Column({ type: 'varchar', nullable: true })
  cardExpiryMonth: string | null;

  @Column({ type: 'varchar', nullable: true })
  cardExpiryYear: string | null;

  // Dados de conta bancária
  @Column({ type: 'varchar', nullable: true })
  bankCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  bankAccountNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  bankAccountDigit: string | null;

  @Column({ type: 'varchar', nullable: true })
  bankAccountType: string | null; // 'checking', 'savings'

  // Chave Pix
  @Column({ type: 'varchar', nullable: true })
  pixKey: string | null;

  @Column({ type: 'varchar', nullable: true })
  pixKeyType: string | null; // 'cpf', 'email', 'phone', 'random'

  // Flags
  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relacionamentos
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  // Metadados
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
