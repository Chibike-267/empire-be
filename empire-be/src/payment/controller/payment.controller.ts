import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { PaymentDto } from '../dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('initialize')
  async processPayment(@Body() paymentDto: PaymentDto) {
    return this.paymentService.processPayment(paymentDto);
  }

  @Post('verify')
  async verifyAndSavePayment(@Body('reference') reference: string) {
    return this.paymentService.verifyAndSavePayment(reference);
  }

  // @Post('initialize')
  // async processPayment(@Body() paymentDto: PaymentDto) {
  //   const result = await this.paymentService.processPayment(paymentDto);
  //   return { authorizationUrl: result.authorizationUrl };
  // }

  // @Post('verify')
  // async verifyAndSavePayment(@Body('reference') reference: string) {
  //   const result = await this.paymentService.verifyAndSavePayment(reference);
  //   return result;
  // }
}
