import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as sgMail from '@sendgrid/mail';
import * as Mailgen from 'mailgen';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class MailerService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY not set in environment variables');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendVerificationEmail(email: string, otp: string) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Empire',
        link: 'https://mailgen.js',
      },
    });

    const user = await this.userRepository.findOne({ where: { email } });
    const userFirstName = user?.firstname ?? 'User';
    const response = {
      body: {
        name: userFirstName,
        intro: `
          <h1>Congratulations!! You have registered successfully</h1>
          <p>Please verify your email address with this OTP: ${otp}</p>`,
      },
    };

    const mailContent = mailGenerator.generate(response);

    const msg = {
      to: email,
      from: this.configService.get<string>('SENDGRID_EMAIL'),
      subject: 'Email Verification',
      html: mailContent,
    };

    try {
      await sgMail.send(msg);
      console.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
