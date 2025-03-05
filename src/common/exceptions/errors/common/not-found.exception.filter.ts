import { HttpException, HttpStatus } from "@nestjs/common";

const msg = "Bad Request Resurce Not Found";

export class NotFoundException extends HttpException {
  constructor(content?: string) {
    super("Not Found", HttpStatus.NOT_FOUND);
    this.name = "Resource not found ";
    this.message = content ? content : msg;
  }
}
