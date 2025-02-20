import { ApiProperty } from "@nestjs/swagger";
import { CvLanguage } from "@prisma/client";
import { Expose } from "class-transformer";

export class CvLanguageResponseDto implements CvLanguage {
  @ApiProperty({
    example: "1a2b3c4d5e6f7g8h9i0j",
    description: "Unique identifier for the language entry",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Identifier of the associated CV",
  })
  @Expose()
  cvId: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the language entry was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2023-01-02T00:00:00.000Z",
    description: "Date when the language entry was last updated",
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    example: "English",
    description: "Name of the language",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: "Fluent",
    description: "Proficiency level in the language",
  })
  @Expose()
  efficiency: string;
}
