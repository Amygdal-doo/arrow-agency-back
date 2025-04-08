import { ApiProperty } from "@nestjs/swagger";
import { MonriCurrency, SUBSCRIPTION_PERIOD } from "@prisma/client";
import { IsString, IsNumber, IsEnum, IsNotEmpty } from "class-validator";
import { ISubscription } from "src/modules/monri/interfaces/subscription.interface";

export class CreateSubscriptionPlanDto implements ISubscription {
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

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1000,
    description: "Price of the plan in minor units",
  })
  price: number;

  @IsEnum(MonriCurrency)
  @IsNotEmpty()
  @ApiProperty({
    enum: MonriCurrency,
    example: MonriCurrency.EUR,
    description: "Currency of the plan",
  })
  currency: MonriCurrency;

  @IsEnum(SUBSCRIPTION_PERIOD)
  @IsNotEmpty()
  @ApiProperty({
    enum: SUBSCRIPTION_PERIOD,
    example: SUBSCRIPTION_PERIOD.month,
    description: "Period of the subscription",
  })
  period: SUBSCRIPTION_PERIOD;
}
