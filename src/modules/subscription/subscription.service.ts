import { Injectable } from "@nestjs/common";
import { Prisma, SUBSCRIPTION_STATUS } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { ILoggedUserInfo } from "../auth/interfaces/logged-user-info.interface";
import { NotFoundException } from "src/common/exceptions/errors/common/not-found.exception.filter";

@Injectable()
export class SubscriptionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    data: Prisma.SubscriptionCreateInput,
    tx?: Prisma.TransactionClient
  ) {
    const prisma = tx || this.databaseService;
    return await prisma.subscription.create({ data });
  }

  async defaultSubscription(
    customerId: string,
    planId: string,
    tx?: Prisma.TransactionClient
  ) {
    // const prisma = tx || this.databaseService;
    return await this.create(
      {
        customer: {
          connect: {
            id: customerId,
          },
        },
        plan: {
          connect: {
            id: planId,
          },
        },
        status: SUBSCRIPTION_STATUS.FREE,
        // nextBillingDate: new Date(),
        startDate: new Date(),
        panToken: "",
        ammount: "0.00",
      },
      tx
    );
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

  async findActiveByCustomerId(
    customerId: string,
    tx?: Prisma.TransactionClient
  ) {
    const prisma = tx || this.databaseService;
    return prisma.subscription.findFirst({
      where: {
        customerId,
        status: SUBSCRIPTION_STATUS.ACTIVE,
      },
      include: {
        plan: true,
        customer: true,
      },
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

  async subcriptionStatus(loggedUserInfoDto: ILoggedUserInfo) {
    const subscription = await this.databaseService.subscription.findMany({
      where: {
        customer: {
          userId: loggedUserInfoDto.id,
        },
        status: {
          in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.FREE],
        },
      },
      include: {
        plan: true,
        // customer: true,
      },
    });

    if (!subscription || subscription.length === 0) {
      throw new NotFoundException("Subscription not found");
    }

    // Check if the subscription is active then return the active one otherwise  return the free one
    let sub = subscription.find(
      (sub) => sub.status === SUBSCRIPTION_STATUS.ACTIVE
    );

    if (!sub) {
      sub = subscription.find((sub) => sub.status === SUBSCRIPTION_STATUS.FREE);
    }

    return {
      ...sub,
      plan: {
        ...sub.plan,
        price: sub.plan.price.toString(),
      },
    };
  }
}
