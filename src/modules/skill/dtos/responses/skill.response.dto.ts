import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Skill } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { PaginationResponseDto } from "src/common/dtos/pagination.dto";

export class SkillResponseDto {
  @ApiProperty({
    example: "824950y793q5tvy4q3905v6y24378w95743w",
    description: "The id of the skill",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Nodejs",
    description: "The name of the skill",
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    example: "This is my skill",
    description: "The description of the skill",
  })
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  createdAt?: Date;

  @ApiProperty()
  @Expose()
  updatedAt?: Date;
}

export class skillPaginationResponseDto extends PaginationResponseDto {
  @Expose()
  @Type(() => SkillResponseDto)
  results: SkillResponseDto[];
}
