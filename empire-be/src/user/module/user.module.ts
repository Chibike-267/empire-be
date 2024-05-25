import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Profile } from '../entity/profile.entity';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { MailerService } from '../service/mailer.service';
import { TokenService } from '../service/token.service';
import { JwtModule } from '../../jwt/module/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]), JwtModule],
  controllers: [UserController],
  providers: [UserService, MailerService, TokenService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
