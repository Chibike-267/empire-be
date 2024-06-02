import { IsString, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Enter your country name' })
  country: string;

  @IsString()
  @IsNotEmpty({ message: 'Enter the name of your city' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'Enter your home address' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'Enter your zip code' })
  zipCode: string;
}
