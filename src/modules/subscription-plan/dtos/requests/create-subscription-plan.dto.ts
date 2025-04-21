import { ApiProperty } from "@nestjs/swagger";
import { SUBSCRIPTION_PERIOD } from "@prisma/client";
import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsDecimal,
} from "class-validator";

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Monthly Plan", description: "Name of the plan" })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "Monthly subscription plan",
    description: "Description of the plan",
  })
  description: string;

  @ApiProperty({
    example: "9.99",
    description: "Price of the plan",
  })
  @IsDecimal({ decimal_digits: "2" })
  @IsNotEmpty()
  price: string;

  // @IsEnum(MonriCurrency)
  // @IsNotEmpty()
  // @ApiProperty({
  //   enum: MonriCurrency,
  //   example: MonriCurrency.EUR,
  //   description: "Currency of the plan",
  // })
  // currency: MonriCurrency;

  @IsEnum(SUBSCRIPTION_PERIOD)
  @IsNotEmpty()
  @ApiProperty({
    enum: SUBSCRIPTION_PERIOD,
    example: SUBSCRIPTION_PERIOD.month,
    description: "Period of the subscription",
  })
  period: SUBSCRIPTION_PERIOD;
}
