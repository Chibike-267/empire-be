import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../user/module/user.module';
import { AuthService } from '../service/auth.service';
//import { JwtModule } from '../../jwt/module/jwt.module';
import { TokenService } from '../../user/service/token.service';
import { JwtAuthGuard } from '../../jwt/guard/jwt.guard';
import { AuthController } from '../controller/auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '5d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
