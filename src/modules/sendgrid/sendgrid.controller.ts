import { Controller } from "@nestjs/common";
import { SendgridService } from "./sendgrid.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("email")
@Controller({ path: "email" })
export class SendgridController {
  constructor(private readonly sendgridService: SendgridService) {}
}
