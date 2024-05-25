import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private logger = new Logger(PaystackService.name);
  private paystackBaseUrl = process.env.PAYSTACK_BASE_URL;
  private paystackSecretKey: string;

  constructor(private configService: ConfigService) {
    this.paystackSecretKey = this.configService.get<string>(
      'PAYSTACK_SECRET_KEY',
    );
    if (!this.paystackSecretKey) {
      throw new BadGatewayException('Paystack secret key not configured');
    }
  }

  async createTransaction(
    email: string,
    amount: number,
    metadata?: any,
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100,
          metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );
      this.logger.log(
        `Transaction initialized: ${JSON.stringify(response.data)}`,
      );
      return response.data.data.authorization_url;
    } catch (err) {
      this.logger.error('Error creating transaction:', err);
      throw err;
    }
    // this.logger.log(`Paystack Base URL: ${this.paystackBaseUrl}`);
    // this.logger.log(`Paystack Secret Key: ${this.paystackSecretKey}`);
  }

  async verifyPayment(reference: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );
      this.logger.log(
        `Payment verification response: ${JSON.stringify(response.data)}`,
      );
      const paymentData = response.data;
      if (paymentData.status === 'success') {
        this.logger.log('Payment successful');
        return true;
      } else {
        this.logger.log(`Payment failed: ${paymentData.gateway_response}`);
        return false;
      }
    } catch (err) {
      this.logger.error('Error verifying payment:', err);
      throw err;
    }
    // this.logger.log(`Paystack Base URL: ${this.paystackBaseUrl}`);
    // this.logger.log(`Paystack Secret Key: ${this.paystackSecretKey}`);
  }
}
