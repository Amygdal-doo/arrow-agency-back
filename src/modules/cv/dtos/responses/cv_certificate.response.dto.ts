import { ApiProperty } from "@nestjs/swagger";
import { Certificate } from "@prisma/client";
import { Expose } from "class-transformer";

export class CvCertificateResponseDto implements Certificate {
  @ApiProperty({
    example: "Software Engineer",
    description: "Name of the certificate",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Unique identifier for the certificate",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Coding Dojo",
    description: "Issuer of the certificate",
  })
  @Expose()
  issuer: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the certificate was issued",
  })
  @Expose()
  issueDate: string;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Date when the certificate was expired",
    nullable: true,
  })
  @Expose()
  expirationDate: string | null;

  @ApiProperty({
    example: "https://example.com",
    description: "Url of the certificate",
    nullable: true,
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
    description: "Date when the certificate was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the certificate was updated",
  })
  @Expose()
  updatedAt: Date;
}
