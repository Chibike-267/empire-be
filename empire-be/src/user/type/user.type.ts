import { HttpException, HttpStatus } from '@nestjs/common';

export class OtpExpiredException extends HttpException {
  constructor() {
    super('OTP Expired', HttpStatus.BAD_REQUEST);
  }
}
