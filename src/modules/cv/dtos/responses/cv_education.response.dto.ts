import { ApiProperty } from "@nestjs/swagger";
import { Education } from "@prisma/client";
import { Expose } from "class-transformer";

export class CvEducationResponseDto implements Education {
  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the education entry",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Stanford University",
    description: "Name of the institution",
  })
  @Expose()
  institution: string;

  @ApiProperty({
    example: "Bachelor's degree",
    description: "Name of the degree",
  })
  @Expose()
  degree: string;

  @ApiProperty({
    example: "Computer Science",
    description: "Field of the degree",
  })
  @Expose()
  field: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the education entry was started",
  })
  @Expose()
  startDate: string;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Date when the education entry was ended",
  })
  @Expose()
  endDate: string | null;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the associated CV",
  })
  @Expose()
  cvId: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the education entry was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2023-01-02T00:00:00.000Z",
    description: "Date when the education entry was last updated",
  })
  @Expose()
  updatedAt: Date;
}
