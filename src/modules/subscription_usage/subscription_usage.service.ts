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
}
