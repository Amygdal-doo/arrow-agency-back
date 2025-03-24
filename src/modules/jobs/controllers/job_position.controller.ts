import { Controller } from "@nestjs/common";
import { JobsService } from "../services/jobs.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Job Position")
@Controller("job-position")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
}
