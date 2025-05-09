import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class SubscriptionUsageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: Prisma.SubscriptionUsageCreateInput) {
    // Implementation for creating a subscription usage record
    const subscriptionUsage =
      await this.databaseService.subscriptionUsage.create({
        data,
      });
    return subscriptionUsage;
  }

  async getOrCreateSubscriptionUsage(subscriptionId: string, userId: string) {
    let usage = await this.databaseService.subscriptionUsage.findFirst({
      where: {
        subscriptionId,
        userId,
      },
    });

    if (!usage) {
      // Create a new usage record if it doesn’t exist
      usage = await this.databaseService.subscriptionUsage.create({
        data: {
          subscriptionId,
          userId,
          cvCreationsUsed: 0,
          jobUploadsUsed: 0,
          cvEditsUsed: 0,
        },
      });
    }
    return usage;
  }

  async incrementCvCreationsUsed(subscriptionId: string, userId: string) {
    const usage = await this.getOrCreateSubscriptionUsage(
      subscriptionId,
      userId
    );
    await this.databaseService.subscriptionUsage.update({
      where: { id: usage.id },
      data: { cvCreationsUsed: { increment: 1 } },
    });
  }
}
