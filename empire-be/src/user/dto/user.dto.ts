import {
  IsIn,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'First name must be a string' })
  @MinLength(1, { message: 'First name is required' })
  @MaxLength(50, {
    message: 'First name should have a maximum length of 50 characters',
  })
  firstname: string;

  @IsString({ message: 'Last name must be a string' })
  @MinLength(1, { message: 'Last name is required' })
  @MaxLength(50, {
    message: 'Last name should have a maximum length of 50 characters',
  })
  lastname: string;

  @IsString({ message: 'User name must be a string' })
  @MinLength(1, {
    message: 'User name should have a minimum length of 1 character',
  })
  @MaxLength(20, {
    message: 'User name should have a maximum length of 20 characters',
  })
  @IsOptional()
  username?: string;

  @IsString({ message: 'Phone number must be a string' })
  @MinLength(11, {
    message: 'Phone number should have a length of 11 characters',
  })
  @MaxLength(11, {
    message: 'Phone number should have a length of 11 characters',
  })
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
  phonenumber: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, {
    message: 'Password should have a minimum length of 6 characters',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message:
      'Password must contain at least one number, one uppercase letter, one symbol and one lowercase letter',
  })
  password: string;
}

export class ResendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserThemeDto {
  @IsString()
  @IsIn(['light', 'dark'])
  theme: string;
}
