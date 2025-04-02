import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  JobStatus,
  MonriCurrency,
  Organization,
  PaymentStatus,
  PaymentType,
  Prisma,
} from "@prisma/client";
import { calculateDigest } from "src/common/helper/digest.helper";
import { toCents } from "src/common/helper/to-cents.helper";
import { IDigest } from "src/common/interfaces/digest.interface";
import { DatabaseService } from "src/database/database.service";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";
import { InitializePaymentDto } from "./dtos/requests/initialize-payment.dto";
import { InitializeTransactionResponseDto } from "./dtos/response/initialize-transaction.response.dto";
import { JobsService } from "../jobs/services/jobs.service";
import { OrganizationService } from "../organization/services/organization.service";
import { NotFoundException } from "src/common/exceptions/errors/common/not-found.exception.filter";
import { MonriTransactionDto } from "./dtos/requests/transaction.dto";

@Injectable()
export class PaymentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private configService: ConfigService,
    private readonly jobService: JobsService,
    private readonly organizationService: OrganizationService
    // private readonly userService: UsersService
  ) {}
  private readonly paymentModel = this.databaseService.payment;

  logger = new Logger(PaymentService.name);

  digest(transactionData: IDigest) {
    //DigestTransactionDataDto
    const key = this.configService.get("MONRI_KEY");
    return calculateDigest(key, transactionData);
  }

  async findById(id: string) {
    return this.paymentModel.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.PaymentUpdateInput) {
    const result = await this.paymentModel.update({
      where: { id },
      data,
    });
    return result;
  }

  async create(
    jobId: string,
    amount: string,
    currency: MonriCurrency,
    loggedUserInfo?: ILoggedUserInfo
  ) {
    const data: Prisma.PaymentCreateInput = {
      job: { connect: { id: jobId } },
      // jobId,
      amount,
      currency,
      paymentType: PaymentType.ONE_TIME,
      status: PaymentStatus.PENDING,
    };
    if (loggedUserInfo) {
      data.user = { connect: { id: loggedUserInfo.id } };
      // data.userId = loggedUserInfo.id;
    }
    const result = await this.paymentModel.create({
      data,
    });
    return result;
  }

  async initializeTransaction(
    initializePaymentDto: InitializePaymentDto,
    loggedUserInfoDto?: ILoggedUserInfo
  ): Promise<InitializeTransactionResponseDto> {
    const job = await this.jobService.findById(initializePaymentDto.jobId);

    if (!job) throw new NotFoundException("Job not found");
    if (job.status == JobStatus.PUBLISHED)
      throw new BadRequestException("Job already published");
    if (!!loggedUserInfoDto) {
      if (job.userId !== loggedUserInfoDto.id)
        throw new ForbiddenException(
          "User not allowed, Cant initialize payment"
        );
    }

    const payment = await this.paymentModel.findFirst({
      where: { jobId: initializePaymentDto.jobId },
    });
    if (payment) throw new BadRequestException("Job already has payment");

    try {
      const { jobId, currency } = initializePaymentDto;
      const price = "6.00";
      const payment = await this.create(
        jobId,
        price,
        currency,
        loggedUserInfoDto ? loggedUserInfoDto : undefined
      );
      console.log({ payment });

      const amountInCents = toCents(Number(price));
      // const uuid = crypto.randomUUID();

      const digestData: IDigest = {
        order_number: payment.id,
        amount: amountInCents,
        currency,
      };
      console.log({ digestData });

      const digest = this.digest(digestData);

      return {
        digest,
        amount: amountInCents,
        currency,
        orderNumber: payment.id,
      };
    } catch (error) {
      console.error("Error Initializing Transaction", error);
      throw new BadRequestException("Error Initializing transaction");
    }
  }

  // async proccessTransaction2(monriTransactionDto: MonriTransactionDto) {
  //   try {
  //     const payment = await this.findById(monriTransactionDto.order_number);

  //     if (!payment) {
  //       // update
  //       throw new BadRequestException("Order not found");
  //     }
  //     // DIGEST
  //     const digestDataOriginal: IDigest = {
  //       order_number: payment.id,
  //       amount: toCents(Number(payment.amount)),
  //       currency: payment.currency,
  //     };
  //     const digestDataIncoming: IDigest = {
  //       order_number: monriTransactionDto.order_number,
  //       amount: monriTransactionDto.amount.toString(),
  //       currency: monriTransactionDto.currency,
  //     };
  //     const digestOriginal = this.digest(digestDataOriginal);
  //     const digestIncoming = this.digest(digestDataIncoming);

  //     if (digestOriginal !== digestIncoming) {
  //       throw new BadRequestException("Invalid digest");
  //     }
  //     if (monriTransactionDto.status === "approved") {
  //       // Update the order status in your database
  //       console.log("Order paid successfully");
  //       const monriOrder = await this.monriOrdersService.findById(
  //         monriTransactionDto.order_number
  //       );

  //       const monriUpdateData: Prisma.MonriOrderUpdateInput = {
  //         status: OrderStatus.COMPLETED,
  //         paymentId: monriTransactionDto.id,
  //         response: JSON.stringify(monriTransactionDto),
  //         orderCreatedAt: monriTransactionDto.created_at,
  //       };

  //       await this.monriOrdersService.update(monriOrder.id, monriUpdateData);

  //       const airaloOrdersData: Prisma.AiraloOrderCreateInput = {
  //         status: OrderStatus.PENDING,
  //         user: { connect: { id: monriOrder.user.id } },
  //         packageId: monriOrder.packageId,
  //         quantity: monriOrder.quantity,
  //         orderCreatedAt: monriTransactionDto.created_at,
  //         transaction: { connect: { id: monriOrder.transaction.id } },
  //       };

  //       const airaloOrders =
  //         await this.airaloOrdersService.create(airaloOrdersData);

  //       const createOrder: ICreateOrder = {
  //         userId: monriOrder.user.id,
  //         transactionId: monriOrder.transaction.id,
  //         quantity: monriOrder.quantity,
  //         package_id: monriOrder.packageId,
  //         description: `${monriOrder.quantity} ${monriOrder.packageId}`,
  //         type: "sim",
  //       };

  //       // call api to create airalo order
  //       await this.airaloOrdersService.createOrder(
  //         createOrder,
  //         airaloOrders.id
  //       );

  //       await this.update(monriOrder.transaction.id, {
  //         status: OrderStatus.COMPLETED,
  //       });

  //       return { message: "Transaction processed successfully" };
  //     } else if (monriTransactionDto.status === "declined") {
  //       // Handle declined or failed transactions
  //       const monriOrder = await this.monriOrdersService.findById(
  //         monriTransactionDto.order_number
  //       );
  //       await this.monriOrdersService.updateOrderStatus(
  //         monriOrder.id,
  //         OrderStatus.FAILED
  //       );

  //       await this.update(monriOrder.transaction.id, {
  //         status: OrderStatus.FAILED,
  //       });

  //       console.log("Transaction Status Declined");
  //       throw new HttpException(
  //         "Transaction Declined",
  //         HttpStatus.PAYMENT_REQUIRED
  //       );
  //     } else {
  //       const monriOrder = await this.monriOrdersService.findById(
  //         monriTransactionDto.order_number
  //       );

  //       await this.monriOrdersService.updateOrderStatus(
  //         monriOrder.id,
  //         OrderStatus.FAILED
  //       );

  //       await this.update(monriOrder.transaction.id, {
  //         status: OrderStatus.FAILED,
  //       });

  //       console.log("Transaction Status Invalid");
  //       throw new HttpException(
  //         "Transaction Invalid",
  //         HttpStatus.PAYMENT_REQUIRED
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error processing Monri callback:", error);
  //     throw new BadRequestException("Error processing transaction");
  //   }
  // }

  async proccessTransaction(monriTransactionDto: MonriTransactionDto) {
    try {
      const payment = await this.findById(monriTransactionDto.order_number);
      if (!payment) throw new BadRequestException("Transaction not found");

      if (payment.status !== PaymentStatus.PENDING)
        throw new BadRequestException("Transaction already processed");

      const jobId = payment.jobId;
      const job = await this.jobService.findById(jobId);
      if (!job)
        throw new BadRequestException("Transaction Failed Job not found");
      const organization = job.organization;
      if (!organization)
        throw new BadRequestException(
          "Transaction Failed Organization not found"
        );

      // DIGEST
      const digestDataOriginal: IDigest = {
        order_number: payment.id,
        amount: toCents(Number(payment.amount)),
        currency: payment.currency,
      };
      const digestDataIncoming: IDigest = {
        order_number: monriTransactionDto.order_number,
        amount: monriTransactionDto.amount.toString(),
        currency: monriTransactionDto.currency,
      };
      const digestOriginal = this.digest(digestDataOriginal);
      const digestIncoming = this.digest(digestDataIncoming);

      if (digestOriginal !== digestIncoming) {
        throw new BadRequestException("Invalid digest");
      }
      if (monriTransactionDto.status === "approved") {
        // Update the order status in your database
        this.logger.log("Order paid successfully");

        const paymentUpdateData: Prisma.PaymentUpdateInput = {
          status: PaymentStatus.COMPLETED,
          monriTransactionId: monriTransactionDto.id,
          transactionResponse: JSON.parse(JSON.stringify(monriTransactionDto)),
          // orderCreatedAt: monriTransactionDto.created_at,
        };

        await this.update(payment.id, paymentUpdateData);
        // update job and organization from DRAFT to PUBLISHED
        const job = await this.jobService.findById(jobId);
        const organization = job.organization;

        await this.jobService.update(jobId, {
          status: JobStatus.PUBLISHED,
        });

        await this.organizationService.update(organization.id, {
          status: JobStatus.PUBLISHED,
        });

        return { message: "Transaction processed successfully" };
      } else if (monriTransactionDto.status === "declined") {
        const paymentUpdateData: Prisma.PaymentUpdateInput = {
          status: PaymentStatus.FAILED,
          monriTransactionId: monriTransactionDto.id,
          transactionResponse: JSON.stringify(monriTransactionDto),
          // orderCreatedAt: monriTransactionDto.created_at,
        };

        await this.update(payment.id, paymentUpdateData);

        // delete the job and organization
        await this.jobService.delete(jobId);
        await this.organizationService.delete(organization.id);
        this.logger.log("Transaction Status Declined");
        throw new HttpException(
          "Transaction Declined",
          HttpStatus.PAYMENT_REQUIRED
        );
      } else {
        const paymentUpdateData: Prisma.PaymentUpdateInput = {
          status: PaymentStatus.FAILED,
          monriTransactionId: monriTransactionDto.id,
          transactionResponse: JSON.stringify(monriTransactionDto),
          // orderCreatedAt: monriTransactionDto.created_at,
        };

        await this.update(payment.id, paymentUpdateData);

        // delete the job and organization
        await this.jobService.delete(jobId);
        await this.organizationService.delete(organization.id);
        this.logger.log("Transaction Status " + monriTransactionDto.status);
        throw new HttpException(
          "Transaction " + monriTransactionDto.status,
          HttpStatus.PAYMENT_REQUIRED
        );
      }
    } catch (error) {
      console.error("Error processing Monri callback:", error);
      throw new BadRequestException("Error processing transaction");
    }
  }
}
