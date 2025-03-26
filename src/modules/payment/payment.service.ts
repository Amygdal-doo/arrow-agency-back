import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { calculateDigest } from "src/common/helper/digest.helper";
import { toCents } from "src/common/helper/to-cents.helper";
import { IDigest } from "src/common/interfaces/digest.interface";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class PaymentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private configService: ConfigService
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

  async initializeTransaction(
    loggedUserInfoDto: LoggedUserInfoDto,
    initializePaymentDto: InitializePaymentDto
  ): Promise<InitializeTransactionResponseDto> {
    const user = await this.userService.findById(loggedUserInfoDto.id);

    if (!user) {
      throw new ForbiddenException(
        "User not found, Cant continue with payment"
      );
    }

    try {
      // const { package, quantity, currency } = initializePaymentDto;
      const monriOrder = await this.monriOrdersService.create(
        loggedUserInfoDto,
        initializePaymentDto
      );

      const amountInCents = toCents(Number(monriOrder.amount));

      const digestData: IDigest = {
        order_number: monriOrder.id,
        amount: amountInCents,
        currency: monriOrder.currency,
      };

      const digest = this.digest(digestData);

      return {
        digest,
        amount: amountInCents,
        currency: monriOrder.currency,
        orderNumber: monriOrder.id,
      };
    } catch (error) {
      console.error("Error Initializing Transaction", error);
      throw new BadRequestException("Error Initializing transaction");
    }
  }
}
