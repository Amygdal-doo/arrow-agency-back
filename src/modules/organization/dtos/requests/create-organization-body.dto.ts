import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { CreatedBy, Prisma } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrganizationBodyDto
  implements Prisma.OrganizationCreateInput
{
  // @ApiProperty({ example: "ACME", description: "The code of the organization" })
  // @IsString()
  // @IsNotEmpty()
  // code: string;

  @ApiProperty({
    example: "ACME INC",
    description: "The name of the organization",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "About ACME INC",
    description: "The about of the organization",
  })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiPropertyOptional({
    example: "Culture about ACME INC",
    description: "The culture of the organization",
  })
  @IsString()
  @IsOptional()
  culture?: string | null;

  @ApiPropertyOptional({
    example: "Benefits of working at ACME INC",
    description: "The benefits of the organization",
  })
  @IsString()
  @IsOptional()
  benefits?: string | null;

  @ApiProperty({
    example: "admin@acme.com",
    description: "The email of the organization",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "New York, USA",
    description: "The location of the organization",
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiHideProperty()
  @IsOptional()
  createdBy: CreatedBy;

  //   @ApiPropertyOptional({
  //     example: true,
  //     description: "Is the organization verified",
  //   })
  //   @IsBoolean()
  //   @IsOptional()
  //   verified?: boolean;

  @ApiPropertyOptional({
    format: "binary",
  })
  @IsString()
  @IsOptional()
  file: string;

  // logo?: Prisma.FileCreateNestedOneWithoutOrganizationInput;
  // jobs?: Prisma.JobCreateNestedManyWithoutOrganizationInpu
}
