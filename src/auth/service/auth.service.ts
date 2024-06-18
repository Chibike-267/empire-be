import {
  Injectable,
  UnauthorizedException,
  //BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { generateVerificationToken } from '../../user/service/util.service';
import { TokenService } from '../../user/service/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (!existingUser) {
        throw new UnauthorizedException('Invalid email');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      console.log(isPasswordValid);

      if (!existingUser.isEmailVerified) {
        throw new UnauthorizedException('Account not verified or inactive');
      }

      const token = this.jwtService.sign(
        { userId: existingUser.id },
        { expiresIn: '5d' },
      );

      return {
        message: 'You have successfully logged in to Empire',
        token,
        user: existingUser,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new InternalServerErrorException('Error logging in');
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!user) {
        throw new NotFoundException('Email does not exist');
      }

      const { id } = user;
      const resetToken = await generateVerificationToken(id);

      user.resetpasswordtoken = resetToken;
      await this.userRepository.save(user);

      await this.tokenService.sendResetToken(email, resetToken);

      return {
        message: 'Reset password link sent to your email',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const jwtSecret = process.env.JWT_SECRET as string;

      const decodedToken = await this.jwtService.verify(token, {
        secret: jwtSecret,
      });

      if (!decodedToken) {
        throw new Error('Invalid or expired token');
      }

      const { userId } = decodedToken as { userId: string };

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordHashed = await bcrypt.hash(
        password,
        await bcrypt.genSalt(),
      );

      await this.userRepository.update(user.id, {
        password: passwordHashed,
        resetpasswordtoken: '',
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error resetting password');
    }
  }
}
