import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entity/payment.entity';
import { Address } from '../entity/address.entity';
import { PaystackService } from '../paystack/paystack.service';
import { PaymentController } from '../controller/payment.controller';
import { PaymentService } from '../service/payment.service';
import { PaymentMethod } from '../entity/payment_method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Address, PaymentMethod])],
  controllers: [PaymentController],
  providers: [PaymentService, PaystackService],
  exports: [PaymentService, PaystackService, TypeOrmModule],
})
export class PaymentModule {}
