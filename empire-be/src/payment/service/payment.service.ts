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

// import { BadRequestException, Injectable } from '@nestjs/common';
// import { PaystackService } from '../../paystack/service/paystack.service';
// import { PaymentDto } from '../dto/payment.dto';
// import { Payment } from '../entity/payment.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// @Injectable()
// export class PaymentService {
//   constructor(
//     private paystackService: PaystackService,
//     @InjectRepository(Payment)
//     private paymentRepository: Repository<Payment>,
//   ) {}

//   async processPayment(
//     paymentDto: PaymentDto,
//   ): Promise<{ authorizationUrl: string }> {
//     // Create a new transaction with Paystack
//     const authorizationUrl = await this.paystackService.createTransaction(
//       paymentDto.email,
//       paymentDto.amount,
//       // Add any additional metadata if needed
//     );

//     return { authorizationUrl };
//     // Return the authorization URL to redirect the user
//   }

//   async verifyAndSavePayment(
//     reference: string,
//     paymentDto: PaymentDto,
//   ): Promise<Payment> {
//     // Implement the payment verification logic after the user completes the payment on Paystack
//     const paymentSuccessful =
//       await this.paystackService.verifyPayment(reference);

//     if (paymentSuccessful) {
//       // Save the payment details to your database
//       const payment = this.paymentRepository.create({
//         amount: paymentDto.amount,
//         currency: paymentDto.currency,
//         email: paymentDto.email,
//         fullName: paymentDto.fullName,
//         description: paymentDto.description,
//         reference, // Save the reference to track the payment
//         address: paymentDto.address,
//         cardNumber: paymentDto.card?.cardNumber,
//         expiryDate: new Date(paymentDto.card?.expiryDate),
//         cvv: paymentDto.card?.cvv,
//         accountNumber: paymentDto.bank?.accountNumber,
//         bankName: paymentDto.bank?.bankName,
//       });
//       const savedPayment = await this.paymentRepository.save(payment);

//       // Return the saved payment
//       return savedPayment;
//     } else {
//       // Handle failed payment
//       throw new BadRequestException('Payment verification failed');
//     }
//   }
// }
