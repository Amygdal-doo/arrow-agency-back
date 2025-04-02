import { Module } from "@nestjs/common";
import { JobsController } from "./controllers/jobs.controller";
import { JobsService } from "./services/jobs.service";
import { JobCategoryService } from "./services/job_category.service";
import { JobCategoryController } from "./controllers/job_category.controller";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [JobsController, JobCategoryController],
  providers: [JobsService, JobCategoryService],
  exports: [JobsService, JobCategoryService],
})
export class JobsModule {}
