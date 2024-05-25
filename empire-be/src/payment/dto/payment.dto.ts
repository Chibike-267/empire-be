import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsNumber,
  Matches,
} from 'class-validator';
import { AddressDto } from './address.dto';

export class CardDto {
  @IsString()
  @MinLength(1, { message: 'Fullname is required' })
  @MaxLength(50, {
    message: 'Fullname should have a maximum length of 50 characters',
  })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Enter your card number' })
  @MinLength(14, {
    message:
      'Card number should have a minimum length of $constraint1 characters',
  })
  @MaxLength(16, {
    message:
      'Card number should have a maximum length of $constraint1 characters',
  })
  cardNumber: string;

  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'Enter your card expiry date in format MM/YY',
  })
  @IsNotEmpty({ message: 'Expiry date is required' })
  expiryDate: string;

  @IsString()
  @MinLength(3, { message: 'CVV should have a minimum length of $constraint1' })
  @MaxLength(4, { message: 'CVV should have a maximum length of $constraint1' })
  @IsNotEmpty({ message: 'CVV is required' })
  cvv: string;
}

export class BankDto {
  @IsString()
  @MinLength(1, { message: 'Name is required' })
  @MaxLength(50, {
    message: 'Name should have a maximum length of 50 characters',
  })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Account number is required' })
  @Matches(/^\d{10}$/, { message: 'Enter correct account number' })
  accountNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Bank name is required' })
  bankName: string;
}

export class PaymentDto {
  @IsNumber({}, { message: 'Amount should be a number' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Select currency from the options' })
  currency: string;

  @IsString()
  @IsNotEmpty({ message: 'Please add a description' })
  @MinLength(1, {
    message: 'Description should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Description should have a maximum length of $constraint1',
  })
  description: string;

  @IsEmail({}, { message: 'Enter the correct email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Fullname is required' })
  @MaxLength(50, {
    message: 'Fullname should have a maximum length of 50 characters',
  })
  fullName: string;

  @IsNotEmpty({ message: 'Card details is required' })
  card?: CardDto;

  @IsNotEmpty({ message: 'Bank details is required' })
  bank?: BankDto;

  @IsNotEmpty({ message: ' Address is required' })
  address: AddressDto;
}
