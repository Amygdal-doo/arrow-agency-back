import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { SortOrder } from "../enums/order.enum";

export class PaginationQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: "Page number. Starts from 1.",
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: "Number of items returned per page.",
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;
}

export class PaginationResponseDto {
  @ApiProperty({ example: 25, description: "Items per page" })
  @Expose()
  limit: number;

  @ApiProperty({ example: 1, description: "Current page" })
  @Expose()
  page: number;

  @ApiProperty({ example: 1, description: "Total pages" })
  @Expose()
  pages: number;

  @ApiProperty({ example: 1, description: "Total items" })
  @Expose()
  total: number;

  @ApiProperty({ example: [], description: "Results" })
  @Expose()
  results: Array<any>;
}

export class OrderType {
  @ApiPropertyOptional({ enum: SortOrder, example: "asc" })
  @IsEnum(SortOrder)
  @IsOptional()
  type?: SortOrder;
}

// export class OrganizationSearchQueryDto {
//   @ApiPropertyOptional({
//     enum: OrganizationSearchBy,
//     example: OrganizationSearchBy.CODE,
//   })
//   @IsEnum(OrganizationSearchBy)
//   @IsOptional()
//   by?: OrganizationSearchBy;

//   @ApiPropertyOptional({ example: "ACME" })
//   @IsString()
//   @IsOptional()
//   search?: string;
// }

export class SearchQueryDto {
  @ApiPropertyOptional({ example: "NODEJS" })
  @IsString()
  @IsOptional()
  search?: string;
}

export class ApplicantsBytechnologiesDto {
  @ApiPropertyOptional({ type: [String] })
  //   @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    console.log(value);
    return typeof value === "string"
      ? value.startsWith("[") && value.endsWith("]")
        ? JSON.parse(value)
        : value.split(",")
      : value;
  })
  technologies: string[];
}
