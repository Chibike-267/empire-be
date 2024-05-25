import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ChildEntity,
  TableInheritance,
} from 'typeorm';

@Entity('payment_method')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

@ChildEntity('Card')
export class Card extends PaymentMethod {
  @Column({ nullable: false })
  cardNumber: string;

  @Column({ type: 'date', nullable: false })
  expiryDate: Date;

  @Column({ nullable: false })
  cvv: string;
}

@ChildEntity('Bank')
export class Bank extends PaymentMethod {
  @Column({ nullable: false })
  accountNumber: string;

  @Column({ nullable: false })
  bankName: string;
}
