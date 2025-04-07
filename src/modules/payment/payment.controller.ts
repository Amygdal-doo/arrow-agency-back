import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import {
  ApiBadRequestResponse,
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
import { InitializePaymentDto } from "./dtos/requests/initialize-payment.dto";
import { Response } from "express";
import { paymentCanceledSwagger } from "./swagger_docs/ok_response/payment_canceled.swagger";
import { paymentSuccessSwagger } from "./swagger_docs/ok_response/payment_successful.swagger";
import { MonriTransactionDto } from "./dtos/requests/transaction.dto";
import { plainToInstance } from "class-transformer";
import { PayByLinkResponseDto } from "./dtos/response/pay-by-link.response.dto";
import { PaymentCallbackResponseDto } from "./dtos/response/payment_callback.response.dto";
import { PaymentCallbackDto } from "./dtos/requests/callback-payment.dto";

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
  //   @Serialize(InitializeTransactionResponseDto)
  //   @ApiOkResponse({ type: InitializeTransactionResponseDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @HttpCode(200)
  async initialize(
    @UserLogged() loggedUserInfoDto: ILoggedUserInfo,
    @Body() body: InitializePaymentDto
  ) {
    return this.paymentService.initializeTransaction(body, loggedUserInfoDto);
  }

  @Post("initialize/not-logged")
  @ApiOperation({
    summary: "Payment initialization",
    description: "Payment initialization",
  })
  @UseFilters(new HttpExceptionFilter())
  //   @Serialize(InitializeTransactionResponseDto)
  //   @ApiOkResponse({ type: InitializeTransactionResponseDto })
  @HttpCode(200)
  async initializeNotLogged(@Body() body: InitializePaymentDto) {
    return this.paymentService.initializeTransaction(body);
  }

  @Post("pay-by-link")
  // @Version('2')
  @ApiOperation({
    summary: "Payment Intent initialization",
    description: "Payment Intent initialization",
  })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(PayByLinkResponseDto)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @HttpCode(200)
  async payByLink(
    @UserLogged() loggedUserInfoDto: ILoggedUserInfo,
    @Body() initializePaymentDto: InitializePaymentDto
  ) {
    return this.paymentService.payByLink(
      initializePaymentDto,
      loggedUserInfoDto
    );
  }

  @Post("pay-by-link/not-logged")
  // @Version('2')
  @ApiOperation({
    summary: "Payment Intent initialization - Not logged",
    description: "Payment Intent initialization",
  })
  @UseFilters(new HttpExceptionFilter())
  @Serialize(PayByLinkResponseDto)
  @ApiOkResponse()
  @HttpCode(200)
  async payByLinkNotLogged(@Body() initializePaymentDto: InitializePaymentDto) {
    return this.paymentService.payByLink(initializePaymentDto);
  }

  @Post("callback")
  @ApiOperation({
    summary: "Payment callback",
    description: "Payment callback",
  })
  // @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  // @Serialize(InitializeTransactionResponseDto)
  // @ApiOkResponse({ type: InitializeTransactionResponseDto })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(200)
  async transaction(@Body() body: any) {
    console.log("🚀 ~ PaymentController ~ initializeTransaction ~ body:", body);
    const parsed = JSON.parse(body.transaction_response);

    // parsed.id , parsed.order_number
    console.log(
      "🚀 ~ PaymentController ~ initializeTransaction ~ parsed:",
      parsed
    );
    let parsedResponse: MonriTransactionDto;
    try {
      parsedResponse = plainToInstance(MonriTransactionDto, parsed, {
        enableCircularCheck: true,
      });
      console.log({ parsedResponse });
      return this.paymentService.proccessTransaction(parsedResponse);
    } catch (error) {
      console.log("err111", error);
      throw new BadRequestException(error.message);
    }
    // return this.paymentService.proccessTransaction(parsedResponse);
    //   id: 882179,
    //   acquirer: 'xml-sim',
    //   order_number: 'c5g2b4385fadk3494',
    //   amount: 300,
    //   currency: 'USD',
    //   outgoing_amount: 300,
    //   outgoing_currency: 'USD',
    //   approval_code: '419333',
    //   response_code: '0000',
    //   response_message: 'transaction approved',
    //   responseCode: '0000',
    //   responseMessage: 'transaction approved',
    //   reference_number: '904653',
    //   systan: '882179',
    //   eci: '06',
    //   xid: null,
    //   acsv: null,
    //   cc_type: 'visa',
    //   status: 'approved',
    //   created_at: '2024-12-11T11:21:44+01:00',
    //   transaction_type: 'purchase',
    //   enrollment: 'N',
    //   authentication: null,
    //   pan_token: null,
    //   issuer: 'off-us',
    //   ch_full_name: 'Test8',
    //   language: 'en',
    //   masked_pan: '405840-xxx-xxx-0005',
    //   number_of_installments: null,
    //   custom_params: '',
    // };

    // return this.paymentService.initializeTransaction(parsedResponse);
  }

  @Get("success")
  @ApiOperation({
    summary: "Payment Success",
    description:
      "Handles payment success callback and renders a success HTML page.",
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiOkResponse(paymentSuccessSwagger)
  @HttpCode(HttpStatus.OK)
  async paymentSuccess(@Query() query: any, @Res() res: Response) {
    console.log("________________________________Payment success", query);

    return res.render("success_payment", {
      order_id: query.order_number,
      status: "approved", // should be dynamic
      amount: Number(query.amount) / 100,
      currency: query.currency,
    });
  }

  @Get("cancel")
  @ApiOperation({
    summary: "Payment Cancelled",
    description:
      "Handles payment cancellation callback and renders a cancellation HTML page.",
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiOkResponse(paymentCanceledSwagger)
  @HttpCode(HttpStatus.OK)
  async paymentCancel(@Query() query: any, @Res() res: Response) {
    console.log("_____________________________Payment Cancel", query);
    return res.render("cancel_payment", {
      order_id: query.order_number,
      status: "cancelled", // should be dynamic
    });
  }

  @Post("callback")
  @ApiOperation({
    summary: "Payment Callback",
    description:
      "Endpoint that handles payment callback after paymnent finishes",
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: "Bad Request" })
  @ApiOkResponse({ type: PaymentCallbackResponseDto })
  @HttpCode(HttpStatus.OK)
  async callbackV2(@Body() body: PaymentCallbackDto) {
    return this.paymentService.paymentCallback(body);
  }
}
