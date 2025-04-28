import { Injectable } from "@nestjs/common";
import { Prisma, SUBSCRIPTION_STATUS } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class SubscriptionService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: Prisma.SubscriptionCreateInput, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.databaseService;
    return prisma.subscription.create({ data });
  }

  async update(
    id: string,
    data: Prisma.SubscriptionUpdateInput,
    tx?: Prisma.TransactionClient
  ) {
    const prisma = tx || this.databaseService;
    return prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async dueSubscriptions() {
    return this.databaseService.subscription.findMany({
      where: {
        status: SUBSCRIPTION_STATUS.ACTIVE,
        nextBillingDate: {
          lte: new Date(),
        },
      },
      include: {
        plan: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
