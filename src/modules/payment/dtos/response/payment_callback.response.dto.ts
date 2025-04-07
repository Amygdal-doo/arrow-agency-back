import { ApiProperty } from "@nestjs/swagger";

export class PaymentCallbackResponseDto {
  @ApiProperty({
    type: String,
    example: "Payment Completed",
  })
  message: string;
}
