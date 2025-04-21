import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class SubscriptionService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: Prisma.SubscriptionCreateInput, tx: Prisma.TransactionClient) {
    const prisma = tx || this.databaseService;
    return prisma.subscription.create({ data });
  }
}
