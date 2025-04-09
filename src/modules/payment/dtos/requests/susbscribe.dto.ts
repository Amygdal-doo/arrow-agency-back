import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty } from "class-validator";

export class SubscribeDto {
  @ApiProperty({
    description: "ID uuid of the PlanId",
    example: "4b97a2a8-54c1-4f6f-9b9a-4c9a3b0df5f2",
  })
  @IsUUID()
  @IsNotEmpty()
  planId: string;
}
