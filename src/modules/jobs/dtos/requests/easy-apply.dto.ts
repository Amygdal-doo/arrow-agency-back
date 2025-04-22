import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class EasyApplyDto {
  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the cv",
  })
  @IsNotEmpty()
  @IsUUID()
  cvId: string;

  @ApiProperty({
    example: "12345678-1234-1234-1234-123456789012",
    description: "The identifier of the job",
  })
  @IsNotEmpty()
  @IsUUID()
  jobId: string;
}
