import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { JobPosition } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { PaginationResponseDto } from "src/common/dtos/pagination.dto";

export class JobPositionResponseDto implements JobPosition {
  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the job position",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Software Engineer",
    description: "The name of the job position",
  })
  @Expose()
  name: string;

  @ApiProperty({ example: "SE", description: "The code of the job position" })
  @Expose()
  code: string;

  @ApiPropertyOptional({
    example: "This is a job position for software engineer",
    description: "The description of the job position",
    required: false,
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "The creation date of the job position",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2022-01-01T00:00:00.000Z",
    description: "The update date of the job position",
  })
  @Expose()
  updatedAt: Date;
}

export class JobPositionPaginationResponseDto extends PaginationResponseDto {
  @Expose()
  @Type(() => JobPositionResponseDto)
  results: JobPositionResponseDto[];
}
