import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MonriService } from "./monri.service";

@ApiTags("Monri")
@Controller("monri")
export class MonriController {
  constructor(private readonly monriService: MonriService) {}

  @Post("create-customer-subscription")
  @ApiOperation({ summary: "Create a customer and subscribe to a plan" })
  async createCustomerSubscription() {
    return this.monriService.createCustomerSubscription();
  }
}
