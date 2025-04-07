import { ApiProperty } from "@nestjs/swagger";
import { MonriCurrency } from "@prisma/client";
import { IsEnum, IsString, IsUUID } from "class-validator";

export class InitializePaymentDto {
  //   @ApiProperty({ description: 'Package data', type: PackageRequestDto })
  //   @ValidateNested()
  //   @Type(() => PackageRequestDto)
  //   packages: PackageRequestDto;

  @ApiProperty({
    description: "ID uuid of the job",
    example: "4b97a2a8-54c1-4f6f-9b9a-4c9a3b0df5f2",
  })
  @IsUUID()
  @IsString()
  jobId: string;

  // @ApiProperty({
  //   description: "Currency",
  //   example: MonriCurrency.USD,
  //   enum: MonriCurrency,
  // })
  // @IsEnum(MonriCurrency)
  // currency: MonriCurrency;
}
