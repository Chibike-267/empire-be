import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '@nestjs/common/exceptions';

export const generateVerificationToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new BadRequestException(
      'JWT_SECRET environment variable is not defined',
    );
  }

  const token = jwt.sign({ id }, jwtSecret, { expiresIn: '5d' });
  return token;
};

export const generateOTP = (): { otp: string; expiry: Date } => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 15 * 60 * 1000);
  return { otp, expiry };
};
