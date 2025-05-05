import { ApiProperty } from "@nestjs/swagger";

export class SubCanceledResponseDto {
  @ApiProperty({
    example: "Subscription canceled successfully",
    description: "Success message",
  })
  message: string;

  @ApiProperty({
    example: "Subscription canceled successfully",
    description: "Success message",
  })
  status: string;
}
