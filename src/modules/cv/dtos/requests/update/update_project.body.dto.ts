import { IsUUID, IsOptional, IsString, IsDateString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProjectDto {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the project",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    example: "Software Engineer",
    description: "Name of the project",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: "Web development",
    description: "Description of the project",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: "2023-01-01",
    description: "Date when the project was started",
  })
  // @IsDateString()
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: "2024-01-01",
    description: "Date when the project was ended",
  })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    example: "https://example.com",
    description: "Url of the project",
  })
  @IsString()
  @IsOptional()
  url?: string;
}
