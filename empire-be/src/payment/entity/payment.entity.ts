import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Status, Type } from '../enum/payment.enum';
import { Address } from './address.entity';
import { PaymentMethod } from './payment_method.entity';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  currency: string;

  @Column({ type: 'enum', enum: Type, nullable: false })
  type: string;

  @Column({ nullable: false })
  description: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: true })
  cardNumber: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  cvv: string;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ unique: true, nullable: false })
  reference: string;

  @Column({ type: 'enum', enum: Status })
  status: string;

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  address: Address;

  @OneToOne(() => PaymentMethod, { eager: true, cascade: true })
  @JoinColumn()
  paymentMethod: PaymentMethod;
}
