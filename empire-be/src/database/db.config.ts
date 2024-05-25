import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Profile } from '../user/entity/profile.entity';
import { Unit } from '../unit/entity/unit.entity';
import { Payment } from '../payment/entity/payment.entity';
import { Reservation } from '../reservation/entity/reservation.entity';
import { Address } from '../payment/entity/address.entity';
import { PaymentMethod } from 'src/payment/entity/payment_method.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  //type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Profile, Unit, Reservation, Payment, Address, PaymentMethod],
  //entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  //logging: true,
};
