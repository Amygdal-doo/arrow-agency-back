import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { JobCategory } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { PaginationResponseDto } from "src/common/dtos/pagination.dto";

export class JobCategoryResponseDto implements JobCategory {
  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the job category",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "INFORMATION TECHNOLOGY",
    description: "The name of the job category",
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    example: "This is a job category for software engineer",
    description: "The description of the job category",
    required: false,
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "The creation date of the job category",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "The update date of the job category",
  })
  @Expose()
  updatedAt: Date;
}

export class JobCategoryPaginationResponseDto extends PaginationResponseDto {
  @Expose()
  @Type(() => JobCategoryResponseDto)
  results: JobCategoryResponseDto[];
}
