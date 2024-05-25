import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private logger = new Logger(PaystackService.name);
  //private paystackBaseUrl = 'https://api.paystack.co';
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

// import { Injectable } from '@nestjs/common';
// import * as PayStack from 'paystack-api';
// import { ConfigService } from '@nestjs/config';
// import { Logger } from '@nestjs/common';
// @Injectable()
// export class PaystackService {
//   private paystack: PayStack;
//   private logger = new Logger(PaystackService.name);
//   constructor(private configService: ConfigService) {
//     const paystackSecretKey = this.configService.get<string>(
//       'PAYSTACK_SECRET_KEY',
//     );
//     this.paystack = new PayStack(paystackSecretKey);
//   }
//   async createTransaction(
//     email: string,
//     amount: number,
//     metadata?: any,
//   ): Promise<string> {
//     try {
//       const transaction = await this.paystack.transaction.initialize({
//         email,
//         amount: amount * 100,
//         metadata,
//       });
//       return transaction.data.authorization_url;
//     } catch (err) {
//       console.error('Error creating transaction:', err);
//       throw err;
//     }
//   }
//   async verifyPayment(reference: string): Promise<boolean> {
//     try {
//       const response = await this.paystack.transaction.verify(reference);
//       if (response.data.status === 'success') {
//         this.logger.log('Payment successful');
//         return true;
//       } else {
//         this.logger.log('Payment failed');
//         return false;
//       }
//     } catch (err) {
//       this.logger.error('Error verifying payment:', err);
//       throw err;
//     }
//   }
// }

// import { Injectable, Inject } from '@nestjs/common';
// import * as PayStack from 'paystack-node';
// import { ConfigService } from '@nestjs/config';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';

// @Injectable()
// export class PaystackService {
//   private paystack: PayStack;

//   constructor(
//     private configService: ConfigService,
//     @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
//   ) {
//     const paystackSecretKey = this.configService.get<string>(
//       'PAYSTACK_SECRET_KEY',
//     );
//     this.paystack = new PayStack(paystackSecretKey);
//   }
//   async createTransaction(
//     email: string,
//     amount: number,
//     metadata?: any,
//   ): Promise<string> {
//     try {
//       const transaction = await this.paystack.transaction.initialize({
//         email,
//         amount: amount * 100,
//         metadata,
//       });
//       return transaction.data.authorization_url;
//     } catch (err) {
//       console.error('Error creating transaction:', err);
//       throw err;
//     }
//   }
//   async verifyPayment(reference: string): Promise<boolean> {
//     try {
//       const response = await this.paystack.transaction.verify(reference);
//       if (response.data.status === 'success') {
//         this.logger.log('Payment successful', 'info', {
//           context: PaystackService.name,
//         });
//         return true;
//       } else {
//         this.logger.log('Payment failed', 'error', {
//           context: PaystackService.name,
//         });
//         return false;
//       }
//     } catch (err) {
//       this.logger.error('Error verifying payment:', err);
//       throw err;
//     }
//   }
// }
