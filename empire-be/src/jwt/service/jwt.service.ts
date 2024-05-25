import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
  }

  generateToken(payload: any, expiresIn: string): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }
}
