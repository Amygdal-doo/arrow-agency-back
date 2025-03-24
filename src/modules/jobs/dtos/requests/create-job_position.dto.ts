import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class CreateJobPositionDto implements Prisma.JobPositionCreateInput {
  @ApiProperty({
    example: "SE",
    description: "The code of the job position",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  code: string;

  @ApiProperty({
    example: "Software Engineer",
    description: "The name of the job position",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: "This is a job position for software engineer",
    description: "The description of the job position",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
