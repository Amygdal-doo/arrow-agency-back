import { Module } from "@nestjs/common";
import { JobsController } from "./controllers/jobs.controller";
import { JobsService } from "./services/jobs.service";
import { JobPositionController } from "./controllers/job_position.controller";
import { JobPositionService } from "./services/job_position.service";
import { JobCategoryService } from "./services/job_category.service";
import { JobCategoryController } from "./controllers/job_category.controller";

@Module({
  controllers: [JobsController, JobPositionController, JobCategoryController],
  providers: [JobsService, JobPositionService, JobCategoryService],
})
export class JobsModule {}
