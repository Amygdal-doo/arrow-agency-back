import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsOptional, IsString } from "class-validator";

export class UpdateCourseDto {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the course",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    example: "Software Engineer",
    description: "Name of the course",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: "https://www.example.com",
    description: "Url of the course",
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the course was started",
  })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the course was ended",
  })
  @IsString()
  @IsOptional()
  endDate?: string;
}
