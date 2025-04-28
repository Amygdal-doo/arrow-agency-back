import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsBoolean } from "class-validator";

export class SubscribeDto {
  @ApiProperty({
    description: "ID uuid of the PlanId",
    example: "4b97a2a8-54c1-4f6f-9b9a-4c9a3b0df5f2",
  })
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({
    example: true,
    description:
      "Set to true if user accepts the terms and conditions(otherwise subscription will not be created). I agree to a monthly subscription of [amount] [currency] starting [date] and authorize [Your Business Name] to charge my card automatically each month. I have read and agree to the [Terms and Conditions] and [Cancellation Policy]. ",
  })
  @IsNotEmpty()
  @IsBoolean()
  consent: boolean;
}
