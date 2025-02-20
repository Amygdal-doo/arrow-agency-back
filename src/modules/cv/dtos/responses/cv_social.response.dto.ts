import { ApiProperty } from "@nestjs/swagger";
import { Social } from "@prisma/client";
import { Expose } from "class-transformer";

export class CvSocialResponseDto implements Social {
  @ApiProperty({
    example: "LinkedIn",
    description: "Name of the social platform",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: "1a2b3c4d5e6f7g8h9i0j",
    description: "Unique identifier for the social entry",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "https://www.linkedin.com/in/johndoe",
    description: "URL of the social profile",
  })
  @Expose()
  url: string;

  @ApiProperty({
    example: "3298457942857024704",
    description: "Identifier of the associated CV",
  })
  @Expose()
  cvId: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Date when the social entry was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2023-01-02T00:00:00.000Z",
    description: "Date when the social entry was last updated",
  })
  @Expose()
  updatedAt: Date;
}
