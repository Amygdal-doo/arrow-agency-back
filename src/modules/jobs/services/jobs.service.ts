import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class JobsService {
  constructor(private readonly databaseService: DatabaseService) {}
  logger: Logger = new Logger(JobsService.name);
}
