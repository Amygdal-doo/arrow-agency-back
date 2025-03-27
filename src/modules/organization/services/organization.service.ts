import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CreatedBy, Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";
import { SpacesDestinationPath } from "src/modules/spaces/enums/spaces-folder-name.enum";
import { IImageUpload } from "src/modules/spaces/interfaces/image-upload.interface";
import { SpacesService } from "src/modules/spaces/spaces.service";
import { CreateOrganizationBodyDto } from "../dtos/requests/create-organization-body.dto";
import {
  OrderType,
  PaginationQueryDto,
  SearchQueryDto,
} from "src/common/dtos/pagination.dto";
import { OrganizationPaginationResponseDto } from "../dtos/responses/organization.response";
import { SortOrder } from "src/common/enums/order.enum";
import { pageLimit } from "src/common/helper/pagination.helper";

@Injectable()
export class OrganizationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly spacesService: SpacesService
  ) {}

  logger: Logger = new Logger(OrganizationService.name);

  async getOrganization(id: string) {
    const organization = await this.databaseService.organization.findUnique({
      where: { id },
      include: {
        jobs: true,
        user: true,
      },
    });
    return organization;
  }

  async findName(name: string) {
    const organization = await this.databaseService.organization.findUnique({
      where: { name },
    });
    return organization;
  }

  async createorganization(
    data: CreateOrganizationBodyDto,
    image: Express.Multer.File | null,
    loggedUserInfo?: ILoggedUserInfo
  ) {
    const { file, createdBy, ...rest } = data;
    let imageFile: IImageUpload | null = null;
    try {
      if (image) {
        imageFile = await this.spacesService.uploadSingleImage(
          image,
          SpacesDestinationPath.COMPANY
        );
      }
    } catch (error) {
      throw new BadRequestException("Something went wrong with file upload");
    }

    rest.name = rest.name;

    const name = await this.findName(rest.name);
    if (name) throw new BadRequestException("Organization name already exist");

    const organization = await this.databaseService.organization.create({
      data: {
        createdBy: loggedUserInfo
          ? CreatedBy.LOGGED_USER
          : CreatedBy.NOT_LOGGED,
        user: loggedUserInfo ? { connect: { id: loggedUserInfo.id } } : null,
        ...rest,
        logo: imageFile
          ? {
              create: {
                url: imageFile.url,
                name: imageFile.name,
                extension: imageFile.extension,
                height: imageFile.height,
                width: imageFile.width,
                fileCreatedAt: imageFile.createdAt,
              },
            }
          : undefined,
      },
    });

    return organization;
  }

  async findAll() {
    const organizations = await this.databaseService.organization.findMany();
    return organizations;
  }

  async organizationsPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    loggedUserInfo?: ILoggedUserInfo
  ): Promise<OrganizationPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = "createdAt";
    const query: Prisma.OrganizationFindManyArgs = {
      where: {
        // userId,
        // name: { contains: paginationQuery.name, mode: 'insensitive' },
      },
    };

    if (!!loggedUserInfo) {
      query.where.userId = loggedUserInfo.id;
    }

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.databaseService.organization.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.databaseService.organization.findMany({
      include: {
        logo: true,
      },
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }

  async organizationsSearchPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    searchQueryDto: SearchQueryDto,
    loggedUserInfo?: ILoggedUserInfo
  ): Promise<OrganizationPaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    // const orderBy = searchQueryDto.by
    //   ? searchQueryDto.by
    //   : "name";
    const orderBy = "name";
    const query: Prisma.OrganizationFindManyArgs = {
      where: {
        // userId,
        [orderBy]: {
          contains: searchQueryDto.search
            ? searchQueryDto.search.toUpperCase()
            : "",
          mode: "insensitive",
        },
      },
    };

    if (!!loggedUserInfo) {
      query.where.userId = loggedUserInfo.id;
    }

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.databaseService.organization.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.databaseService.organization.findMany({
      include: {
        logo: true,
      },
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }
}
