import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumberString,
  IsDecimal,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MonriCurrency } from "@prisma/client";

export class CreatePackageDto {
  @ApiProperty({
    example: "Basic Package",
    description: "Name of the package",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "This is a basic package",
    description: "Description of the basic package",
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: "1000",
    description: "Price of the package in minor units",
  })
  @IsDecimal({ decimal_digits: "2" })
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    enum: MonriCurrency,
    example: MonriCurrency.EUR,
    description: "Currency of the package",
  })
  @IsEnum(MonriCurrency)
  @IsNotEmpty()
  currency: MonriCurrency;
}
