import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { addMonths, format } from "date-fns";

@Controller()
export class AppController {
  constructor() {}

  @Get("hello")
  @ApiOperation({
    summary: "Get Hello",
    description: "Get Hello",
  })
  async getHello(): Promise<string> {
    let a = addMonths(new Date(), 1);

    console.log(a);

    return "Hello World";
  }
}
