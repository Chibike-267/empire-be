import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Profile } from '../user/entity/profile.entity';
import { Unit } from '../unit/entity/unit.entity';
import { Payment } from '../payment/entity/payment.entity';
import { Reservation } from '../reservation/entity/reservation.entity';
import { Address } from '../payment/entity/address.entity';
import { PaymentMethod } from 'src/payment/entity/payment_method.entity';

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  //type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Profile, Unit, Reservation, Payment, Address, PaymentMethod],
  //entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  //logging: true,
};
