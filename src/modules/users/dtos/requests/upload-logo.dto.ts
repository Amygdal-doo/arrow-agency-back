import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class uploadCompanyLogoDto {
  @ApiProperty({
    format: "binary",
  })
  @IsString()
  file: string;
}
