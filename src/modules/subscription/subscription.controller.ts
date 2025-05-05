import { Controller, Get, UseFilters, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "./subscription.service";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { UserLogged } from "../auth/decorators/user.decorator";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get("/status")
  @ApiOperation({
    summary: "subscription status",
    description: "Get the subscription status of the logged-in user",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  async getSubscriptionStatus(
    @UserLogged() loggedUserInfoDto: ILoggedUserInfo
  ) {
    return this.subscriptionService.subcriptionStatus(loggedUserInfoDto);
  }
}
