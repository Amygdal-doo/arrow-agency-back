import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsOptional, IsString } from "class-validator";

export class UpdateExperienceDto {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the experience",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    example: "Software Engineer",
    description: "Position of the experience",
  })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({
    example: "Coding Dojo",
    description: "Company of the experience",
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the experience was started",
  })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: "2024-01-01T00:00:00.000Z",
    description: "Date when the experience was ended",
  })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    example: "I worked as a software engineer at Coding Dojo",
    description: "Description of the experience",
  })
  @IsString()
  @IsOptional()
  description?: string;
}
