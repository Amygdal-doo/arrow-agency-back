import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { SubscriptionPlanService } from "./subscription-plan.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { SubscriptionPlanResponseDto } from "../monri/dtos/response/subscription_plan.response.dto";
import { CreateSubscriptionPlanDto } from "./dtos/requests/create-subscription-plan.dto";
import { UserLogged } from "../auth/decorators/user.decorator";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";
import { PermissionsGuard } from "../auth/permission-guard/permissions.guard";

@Controller("subscription-plan")
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService
  ) {}

  @ApiProperty({ type: [SubscriptionPlanResponseDto] })
  async findAll() {
    return this.subscriptionPlanService.findAll();
  }

  async findById(id: string) {
    return this.subscriptionPlanService.findById(id);
  }

  @Post("subscription-plan")
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @Roles(Role.USER)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  // @Serialize(JobResponseDto)
  // @ApiOkResponse({ type: JobResponseDto })
  @ApiOperation({ summary: "Create a subscription plan" })
  async create(
    @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Body() data: CreateSubscriptionPlanDto
  ) {
    return this.subscriptionPlanService.createSubPlan(data, loggedUserInfo);
  }
}
