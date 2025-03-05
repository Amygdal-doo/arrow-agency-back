import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class SuccesfullUpdateDto {
  @ApiProperty({ example: "Updated successfully" })
  @Expose()
  message: string;
}
