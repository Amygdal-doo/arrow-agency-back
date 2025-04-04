import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MonriService } from "./monri.service";
import { UserLogged } from "../auth/decorators/user.decorator";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";
import { CreateSubscriptionPlanDto } from "./dtos/requests/create-subscription-plan.dto";

@ApiTags("Monri")
@Controller("monri")
export class MonriController {
  constructor(private readonly monriService: MonriService) {}

  @Post("create-customer-subscription")
  @ApiOperation({ summary: "Create a customer and subscribe to a plan" })
  async createCustomerSubscription() {
    return this.monriService.createCustomerSubscription();
  }

  @Post("subscription-plan")
  // @ApiBearerAuth("Access Token")
  // @UseFilters(new HttpExceptionFilter())
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiUnauthorizedResponse({ description: "Unauthorized" })
  // @Serialize(JobResponseDto)
  // @ApiOkResponse({ type: JobResponseDto })
  @ApiOperation({ summary: "Create a subscribtion plan" })
  async createSubscriptionPlan(
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Body() data: CreateSubscriptionPlanDto
  ) {
    return this.monriService.createCustomerSubscription();
  }
}
