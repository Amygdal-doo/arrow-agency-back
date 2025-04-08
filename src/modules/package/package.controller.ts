import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { PackageService } from "./package.service";
import { CreatePackageDto } from "./dtos/requests/create_package.dto";
import { Role } from "@prisma/client";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { PermissionsGuard } from "../auth/permission-guard/permissions.guard";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import { PackageResponseDto } from "./dtos/responses/package.response.dto";

@ApiTags("Package")
@Controller("package")
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @ApiOperation({ summary: "Create package - super admin" })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(PackageResponseDto)
  @ApiOkResponse({ type: PackageResponseDto })
  async create(
    // @UserLogged() loggedUserInfo: ILoggedUserInfo,
    @Body() data: CreatePackageDto
  ) {
    return this.packageService.create(data);
  }

  @Get()
  @Serialize(PackageResponseDto)
  @ApiOkResponse({ type: [PackageResponseDto] })
  @ApiOperation({ summary: "Get all packages" })
  findAll() {
    return this.packageService.findAll();
  }

  @Get(":id")
  @Serialize(PackageResponseDto)
  @ApiOkResponse({ type: PackageResponseDto })
  @ApiOperation({ summary: "Get package by id" })
  findById(@Param(ParseUUIDPipe) id: string) {
    return this.packageService.findById(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete package - super admin" })
  @ApiBearerAuth("Access Token")
  @UseFilters(new HttpExceptionFilter())
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Serialize(PackageResponseDto)
  @ApiOkResponse({ type: PackageResponseDto })
  async delete(@Param(ParseUUIDPipe) id: string) {
    return this.packageService.delete(id);
  }
}
