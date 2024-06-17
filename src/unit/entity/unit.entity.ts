import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Status, Type } from '../enum/unit.enum';
import { Reservation } from '../../reservation/entity/reservation.entity';

@Entity('unit')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  location: string;

  @Column({ type: 'enum', enum: Type })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'enum', enum: Status })
  status: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  unitNumber: string;

  @Column({ nullable: false })
  noOfBedroom: number;

  @Column('simple-array', { nullable: false })
  photo: string[];

  @OneToMany(() => Reservation, (reservation) => reservation.unit)
  reservations: Reservation[];
}

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   OneToMany,
//   ManyToOne,
// } from 'typeorm';
// import { Reservation } from '../../reservation/entity/reservation.entity';

// @Entity('unit')
// export class Unit {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ nullable: false })
//   name: string;

//   @Column({ nullable: false })
//   location: string;

//   @Column({
//     type: 'enum',
//     enum: ['Self-contain', 'Duplex', 'Flat'],
//     nullable: false,
//   })
//   type: string;

//   @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
//   price: number;

//   @Column({
//     type: 'enum',
//     enum: ['Available', 'Occuppied'],
//     nullable: false,
//   })
//   status: string;

//   @Column({ nullable: false })
//   description: string;

//   @Column({ nullable: false })
//   unitNumber: string;

//   @Column({ nullable: false })
//   noOfBedroom: number;

//   @Column('simple-array', { nullable: false })
//   photo: string[];

//   @OneToMany(() => Reservation, (reservation) => reservation.unit)
//   reservations: Reservation[];
// }
