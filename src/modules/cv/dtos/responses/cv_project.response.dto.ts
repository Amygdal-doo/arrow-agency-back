import { ApiProperty } from "@nestjs/swagger";
import { Project } from "@prisma/client";
import { Expose } from "class-transformer";

export class CvProjectResponseDto implements Project {
  @ApiProperty({
    example: "Software Engineer",
    description: "Name of the project",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the project",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Web development",
    description: "Description of the project",
  })
  @Expose()
  description: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the project was started",
  })
  @Expose()
  startDate: string;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Date when the project was ended",
  })
  @Expose()
  endDate: string | null;

  @ApiProperty({
    example: "https://example.com",
    description: "Url of the project",
  })
  @Expose()
  url: string | null;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the associated CV",
  })
  @Expose()
  cvId: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the project was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Date when the project was last updated",
  })
  @Expose()
  updatedAt: Date;
}
