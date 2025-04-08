import { BadRequestException, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreatePackageDto } from "./dtos/requests/create_package.dto";
import { MonriCurrency } from "@prisma/client";

@Injectable()
export class PackageService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly packageModel = this.databaseService.package;

  async findAll() {
    const packages = await this.packageModel.findMany();
    console.log({ packages });
    return packages;
  }

  findById(id: string) {
    return this.packageModel.findUnique({ where: { id } });
  }

  create(data: CreatePackageDto) {
    if (data.currency !== MonriCurrency.USD)
      throw new BadRequestException("Currency not supported");
    return this.packageModel.create({ data });
  }

  delete(id: string) {
    return this.packageModel.delete({ where: { id } });
  }
}
