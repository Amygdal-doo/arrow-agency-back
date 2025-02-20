import { ApiProperty } from "@nestjs/swagger";
import { Course } from "@prisma/client";
import { Expose } from "class-transformer";

export class CvCourseResponseDto implements Course {
  @ApiProperty({
    example: "Software Engineer",
    description: "Name of the course",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the course",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "https://www.example.com",
    description: "Url of the course",
  })
  @Expose()
  url: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the course was started",
  })
  @Expose()
  startDate: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the course was ended",
  })
  @Expose()
  endDate: string | null;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Identifier of the associated CV",
  })
  @Expose()
  cvId: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the course was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the course was last updated",
  })
  @Expose()
  updatedAt: Date;
}
