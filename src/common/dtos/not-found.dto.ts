import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class NotFoundDto {
  @ApiProperty({
    type: Number,
    description: "HTTP status code",
    example: 404,
  })
  @Expose()
  statusCode: number;

  @ApiProperty({
    type: String,
    description: "Error type",
    example: "Resource Not Found",
  })
  @Expose()
  type: string;

  @ApiProperty({
    type: [String],
    description: "Error messages",
    example: ["Bad Request Resurce Not Found"],
  })
  @Expose()
  errors: string[];
}
