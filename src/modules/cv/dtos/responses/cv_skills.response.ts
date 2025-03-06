import { ApiProperty } from "@nestjs/swagger";
import { Skills } from "@prisma/client";
import { Expose } from "class-transformer";

export class CvSkillResponseDto implements Skills {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the skill",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Software Engineer",
    description: "Name of the skill",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: "intermediate",
    description: "Proficiency level in the skill",
  })
  @Expose()
  efficiency: string;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Identifier of the associated CV",
  })
  @Expose()
  cvId: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the skill was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2023-01-02T00:00:00.000Z",
    description: "Date when the skill was last updated",
  })
  @Expose()
  updatedAt: Date;
}
