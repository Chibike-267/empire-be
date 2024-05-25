import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
  ArrayMinSize,
  //IsEnum,
} from 'class-validator';

export class AddUnitDto {
  @IsString()
  @IsNotEmpty({ message: 'Unit name is required' })
  @MinLength(1, {
    message: 'Unit name should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Unit name should have a maximum length of $constraint1',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  @MinLength(1, {
    message: 'Location should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Location should have a maximum length of $constraint1',
  })
  location: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one image is required' })
  photo: string[];

  @IsString()
  @IsNotEmpty({ message: 'Specify the type of Unit' })
  @MinLength(1, {
    message: 'Type of Unit should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Type of Unit should have a maximum length of $constraint1',
  })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  @MinLength(1, {
    message: 'Status should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Status should have a maximum length of $constraint1',
  })
  status: string;

  @IsString()
  @IsNotEmpty({ message: 'Please add a description' })
  @MinLength(1, {
    message: 'Description should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Description should have a maximum length of $constraint1',
  })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Specify the Unit Number' })
  @MinLength(1, {
    message: 'Unit Number should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Unit Number should have a maximum length of $constraint1',
  })
  unitNumber: string;

  @IsNumber({}, { message: 'Price is required' })
  price: number;

  @IsNumber({}, { message: 'Please specify the number of bedrooms' })
  noOfBedroom: number;
}

export class EditUnitDto {
  @IsString()
  @IsNotEmpty({ message: 'Unit name is required' })
  @MinLength(1, {
    message: 'Unit name should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Unit name should have a maximum length of $constraint1',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  @MinLength(1, {
    message: 'Location should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Location should have a maximum length of $constraint1',
  })
  location: string;

  @IsArray({ message: 'At least one image is required' })
  photo: string[];

  @IsString()
  @IsNotEmpty({ message: 'Specify the type of Unit' })
  @MinLength(1, {
    message: 'Type of Unit should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Type of Unit should have a maximum length of $constraint1',
  })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  @MinLength(1, {
    message: 'Status should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Status should have a maximum length of $constraint1',
  })
  status: string;

  @IsString()
  @IsNotEmpty({ message: 'Please add a description' })
  @MinLength(1, {
    message: 'Description should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Description should have a maximum length of $constraint1',
  })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Specify the Unit Number' })
  @MinLength(1, {
    message: 'Unit Number should have a minimum length of $constraint1',
  })
  @MaxLength(255, {
    message: 'Unit Number should have a maximum length of $constraint1',
  })
  unitNumber: string;

  @IsNumber({}, { message: 'Price is required' })
  price: number;

  @IsNumber({}, { message: 'Please specify the number of bedrooms' })
  noOfBedroom: number;
}
