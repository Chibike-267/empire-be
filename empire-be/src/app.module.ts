import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from './multer/module/multer.module';
import { databaseConfig } from './database/db.config';
import { UserModule } from './user/module/user.module';
import { AuthModule } from './auth/module/auth.module';
import { UnitModule } from './unit/module/unit.module';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from './reservation/module/reservation.module';
import { CloudinaryModule } from './cloudinary/module/cloudinary.module';
import { PaymentModule } from './payment/module/payment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    UnitModule,
    ReservationModule,
    PaymentModule,
    FileUploadModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
