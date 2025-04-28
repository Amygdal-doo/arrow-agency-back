import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
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
import { PermissionsGuard } from "../auth/permission-guard/permissions.guard";

@Controller("subscription-plan")
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService
  ) {}

  @Get("")
  @ApiProperty({ type: [SubscriptionPlanResponseDto] })
  @ApiOperation({ summary: "Get all subscription plans" })
  async findAll() {
    return this.subscriptionPlanService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get subscription plan by id" })
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    return this.subscriptionPlanService.findById(id);
  }

  @Post("")
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  // @Serialize(JobResponseDto)
  // @ApiOkResponse({ type: JobResponseDto })
  @ApiOperation({ summary: "Create a subscription plan - Super Admin" })
  async create(
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Body() data: CreateSubscriptionPlanDto
  ) {
    return this.subscriptionPlanService.createSubPlan(data);
  }
}
