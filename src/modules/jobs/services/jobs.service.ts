import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class JobsService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger: Logger = new Logger(JobsService.name);

  private readonly JobModel = this.databaseService.job;
  private readonly JobCategoryModel = this.databaseService.jobCategory;
  private readonly JobPositionModel = this.databaseService.jobPosition;

  // async findName(name: string) {
  //   const organization = await this.databaseService.organization.findUnique({
  //     where: { name },
  //   });
  //   return organization;
  // }

  // async findCode(code: string) {
  //   const organization = await this.databaseService.organization.findUnique({
  //     where: { code },
  //   });
  //   return organization;
  // }
}
