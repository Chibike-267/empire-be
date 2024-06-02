import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Status } from '../enum/reservation.enum';
import { Unit } from '../../unit/entity/unit.entity';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nameofcustomer', nullable: false })
  nameOfCustomer: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phonenumber', nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  location: string;

  @Column({ name: 'checkindate', type: 'date', nullable: false })
  checkInDate: Date;

  @Column({ name: 'checkoutdate', type: 'date', nullable: false })
  checkOutDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.RESERVE,
    nullable: false,
  })
  status: string;

  @ManyToOne(() => Unit, (unit) => unit.reservations)
  unit: Unit;
}
