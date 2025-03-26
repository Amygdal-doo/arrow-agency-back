import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import { UserLogged } from "../auth/decorators/user.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("initialize")
  @ApiOperation({
    summary: "Payment initialization",
    description: "Payment initialization",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(InitializeTransactionResponseDto)
  @ApiOkResponse({ type: InitializeTransactionResponseDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @HttpCode(200)
  async initialize(
    @UserLogged() loggedUserInfoDto: ILoggedUserInfo,
    @Body() body: InitializePaymentDto
  ) {
    return this.paymentService.initializeTransaction(loggedUserInfoDto, body);
  }
}
