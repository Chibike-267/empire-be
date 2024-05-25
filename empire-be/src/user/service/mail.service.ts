import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as Mailgen from 'mailgen';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    //sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'empirechico.com',
        link: 'https://mailgen.js',
      },
    });

    const user = await this.userRepository.findOne({ where: { email } });
    const userFirstName = user?.firstname ?? 'User';

    const response = {
      body: {
        name: userFirstName,
        intro: `
          <p>We received a request to reset your password. If you did not make this request, you can safely ignore this email.</p>
          <p>To reset your password, click on the following link below:</p>
          <a href="http://localhost:5173/reset-password/${token}" style="text-decoration: underline; color: #007BFF; font-weight: bold;">Reset Password</a>
          <p>This link expires in 15 minutes</p>`,
        outro: `<p>If you have any questions, please contact our support team.</p>`,
      },
    };

    const mailContent = mailGenerator.generate(response);

    const msg = {
      to: email,
      from: this.configService.get<string>('SENDGRID_EMAIL'),
      subject: 'Reset Password Email',
      html: mailContent,
    };

    try {
      await sgMail.send(msg);
      console.log(`Reset token email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending reset link email:', error);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
