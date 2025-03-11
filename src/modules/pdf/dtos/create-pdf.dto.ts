import { ApiProperty } from "@nestjs/swagger";
import { ICvData } from "../interfaces/cv-data.interface";
import { IsObject, IsString } from "class-validator";

export class createPdfDto {
  @ApiProperty({
    type: Object,
  })
  @IsObject({})
  data: ICvData;

  @ApiProperty({
    type: String,
  })
  @IsString()
  templateId: string;
}
