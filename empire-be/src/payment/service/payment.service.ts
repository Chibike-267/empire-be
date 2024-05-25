import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaystackService } from '../paystack/paystack.service';
import { PaymentDto } from '../dto/payment.dto';
import { Payment } from '../entity/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private paystackService: PaystackService,
  ) {}

  async processPayment(
    paymentDto: PaymentDto,
  ): Promise<{ authorizationUrl: string }> {
    const { email, amount, ...otherDetails } = paymentDto;
    const authorizationUrl = await this.paystackService.createTransaction(
      email,
      amount,
      otherDetails,
    );
    return { authorizationUrl };
  }

  async verifyAndSavePayment(reference: string): Promise<{ message: string }> {
    const isVerified = await this.paystackService.verifyPayment(reference);

    if (isVerified) {
      const payment = this.paymentRepository.create({
        reference,
        status: 'verified',
      });

      await this.paymentRepository.save(payment);

      return { message: 'Payment verified and saved successfully' };
    } else {
      throw new PreconditionFailedException('Payment verification failed');
    }
  }
}
