import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class CreateJobCategoryDto implements Prisma.JobCategoryCreateInput {
  // @ApiProperty({
  //   example: "IT",
  //   description: "The code of the job category",
  // })
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(10)
  // code: string;

  @ApiProperty({
    example: "INFORMATION TECHNOLOGY",
    description: "The name of the job category",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: "This is a job category for software engineer",
    description: "The description of the job category",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
