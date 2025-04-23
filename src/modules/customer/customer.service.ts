import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class CustomerService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.databaseService;
    return prisma.customer.findUnique({
      include: {
        user: true,
      },
      where: {
        id,
      },
    });
  }

  async findByUserId(userId: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.databaseService;
    return prisma.customer.findUnique({
      where: {
        userId,
      },
    });
  }

  async create(
    data: Prisma.CustomerCreateInput,
    tx?: Prisma.TransactionClient
  ) {
    const prisma = tx || this.databaseService;
    return prisma.customer.create({
      data,
    });
  }
  // upsert
  // async upsert(
  //   data: Prisma.CustomerCreateInput,
  //   tx?: Prisma.TransactionClient
  // ) {
  //   const prisma = tx || this.databaseService;
  //   return prisma.customer.upsert({
  //     where: {
  //       userId: data.userId,
  //     },
  //     update: data,
  //     create: data,
  //   });
  // }
}
