import { Injectable } from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly userModel = this.databaseService.user;

  async create(data: Prisma.UserCreateInput) {
    if (!data.role) data.role = Role.USER;
    return await this.databaseService.user.create({
      data: {
        ...data,
        profile: {
          create: {
            address: "example address",
            phoneNumber: "0000000000",
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    const result = await this.userModel.findUnique({
      where: { email },
    });
    return result;
  }

  async findById(id: string) {
    const result = await this.userModel.findUnique({
      where: { id },
    });
    return result;
  }

  async getLoggedUser(id: string) {
    const user = await this.findById(id);
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const result = await this.userModel.update({
      where: { id },
      data,
    });
    return result;
  }
}
