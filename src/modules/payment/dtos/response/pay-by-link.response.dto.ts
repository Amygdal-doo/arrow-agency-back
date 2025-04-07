import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PayByLinkResponseDto {
  @ApiProperty({
    example: 'https://monri.com/payment/url',
    description: 'Payment URL',
  })
  @Expose()
  paymentUrl: string;
}
