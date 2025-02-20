import { IsUUID, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCvLanguageDto {
  @ApiProperty({
    example: "1a2b3c4d5e6f7g8h9i0j",
    description: "Unique identifier for the language entry",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    example: "English",
    description: "Name of the language",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: "Fluent",
    description: "Proficiency level in the language",
  })
  @IsString()
  @IsOptional()
  efficiency?: string;
}
