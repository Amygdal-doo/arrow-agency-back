import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";
import { SpacesDestinationPath } from "src/modules/spaces/enums/spaces-folder-name.enum";
import { IImageUpload } from "src/modules/spaces/interfaces/image-upload.interface";
import { SpacesService } from "src/modules/spaces/spaces.service";
import { CreateOrganizationBodyDto } from "../dtos/requests/create-organization-body.dto";
import { url } from "inspector";

@Injectable()
export class OrganizationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly spacesService: SpacesService
  ) {}

  logger: Logger = new Logger(OrganizationService.name);

  create(data: Prisma.OrganizationCreateInput) {
    return this.databaseService.organization.create({ data });
  }

  async createorganization(
    data: CreateOrganizationBodyDto,
    loggedUserInfo: ILoggedUserInfo,
    image?: Express.Multer.File
  ) {
    const { file, ...rest } = data;
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

    const organization = await this.databaseService.organization.create({
      data: {
        ...rest,
      },
    });
  }

  async findAll() {
    const organizations = await this.databaseService.organization.findMany();
    return organizations;
  }
}
