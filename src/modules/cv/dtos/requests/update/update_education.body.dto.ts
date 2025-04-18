import { IsUUID, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateEducationDto {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the education entry",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    example: "Stanford University",
    description: "Name of the institution",
  })
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional({
    example: "Bachelor's degree",
    description: "Name of the degree",
  })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({
    example: "Computer Science",
    description: "Field of the degree",
  })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiPropertyOptional({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the education entry was started",
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    example: "2024-01-01T00:00:00.000Z",
    description: "Date when the education entry was ended",
  })
  @IsOptional()
  @IsString()
  endDate?: string;
}
