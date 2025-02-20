import { ApiProperty } from "@nestjs/swagger";
import { Experience } from "@prisma/client";
import { Expose } from "class-transformer";

export class CvExperienceResponseDto implements Experience {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the experience",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Software Engineer",
    description: "Position of the experience",
  })
  @Expose()
  position: string;

  @ApiProperty({
    example: "Coding Dojo",
    description: "Company of the experience",
  })
  @Expose()
  company: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the experience was started",
  })
  @Expose()
  startDate: string;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Date when the experience was ended",
  })
  @Expose()
  endDate: string | null;

  @ApiProperty({
    example: "I worked as a software engineer at Coding Dojo",
    description: "Description of the experience",
  })
  @Expose()
  description: string;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the associated CV",
  })
  @Expose()
  cvId: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the experience was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2023-01-02T00:00:00.000Z",
    description: "Date when the experience was last updated",
  })
  @Expose()
  updatedAt: Date;
}
