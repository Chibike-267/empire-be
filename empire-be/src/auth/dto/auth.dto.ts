import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  //MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  // @IsString({ message: 'User name must be a string' })
  // @MinLength(1, {
  //   message: 'User name should have a minimum length of 1 character',
  // })
  // @MaxLength(20, {
  //   message: 'User name should have a maximum length of 20 characters',
  // })
  // username?: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password should have a minimum length of 6 characters',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      'Password must contain at least one number, one uppercase letter, and one lowercase letter',
  })
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsString()
  confirmPassword: string;
}
