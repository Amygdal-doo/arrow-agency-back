import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class uploadCompanyLogoDto {
  @ApiProperty({
    format: "binary",
  })
  @IsString()
  file: string;
}
