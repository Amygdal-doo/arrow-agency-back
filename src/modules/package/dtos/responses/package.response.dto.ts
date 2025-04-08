import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MonriCurrency, Package } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Expose, Type } from "class-transformer";

export class PackageResponseDto implements Package {
  @ApiProperty({
    example: "01G5QHJ5KK1R9G0T7QXJX5V3B9",
    description: "Unique identifier for the package",
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: "Basic Package",
    description: "Name of the package",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: "1000",
    description: "Price of the package in minor units",
  })
  @Expose()
  @Type(() => String)
  price: Decimal;

  @ApiProperty({
    enum: MonriCurrency,
    example: MonriCurrency.EUR,
    description: "Currency of the package",
  })
  @Expose()
  currency: MonriCurrency;

  @ApiPropertyOptional({
    example: "This is a basic package",
    description: "Description of the basic package",
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    example: "2022-02-02T14:30:00.000Z",
    description: "Date when the package was created",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2022-02-02T14:30:00.000Z",
    description: "Date when the package was last updated",
  })
  @Expose()
  updatedAt: Date;
}
