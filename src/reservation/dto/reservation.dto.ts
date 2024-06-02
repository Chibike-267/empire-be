import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  //IsUUID,
  Length,
} from 'class-validator';
//import { Status } from 'src/enums/reservation.enum';

export class ReserveUnitDto {
  @IsString()
  @IsNotEmpty({ message: 'Name of Customer is required' })
  nameOfCustomer: string;

  @IsEmail({}, { message: 'Enter the correct email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone Number is required' })
  @Length(11, 11, { message: 'Phone number should have the length of 11' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsDateString({}, { message: 'Enter a correct date format (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Check-in Date is required' })
  checkInDate: string;

  @IsDateString({}, { message: 'Enter a correct date format (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Check-out Date is required' })
  checkOutDate: string;

  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
}

export class EditDto {
  @IsString()
  @IsNotEmpty({ message: 'Name of Customer is required' })
  nameOfCustomer: string;

  @IsEmail({}, { message: 'Enter the correct email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone Number is required' })
  @Length(11, 11, { message: 'Phone number should have the length of 11' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsDateString({}, { message: 'Enter a correct date format (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Check-in Date is required' })
  checkInDate: Date;

  @IsDateString({}, { message: 'Enter a correct date format (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Check-out Date is required' })
  checkOutDate: Date;

  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
}
