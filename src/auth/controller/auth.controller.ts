import {
  Controller,
  Post,
  Body,
  Param,
  ValidationPipe,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response, Request } from 'express';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../../jwt/guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body(new ValidationPipe()) body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body.email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(
      token,
      resetPasswordDto.password,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logoutUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
  }
}
