/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentFailedException extends HttpException {
  constructor() {
    super('BadRequest', HttpStatus.BAD_REQUEST);
    this.name = 'Payment failed.';
    this.message = 'Something went wrong with your payment. Please try again.';
  }
}
