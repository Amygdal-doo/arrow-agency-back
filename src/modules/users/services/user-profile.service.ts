import { BadRequestException, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { UpdateUserProfileDto } from "../dtos/requests/update-user-profile.dto";
import { Prisma, Profile } from "@prisma/client";
import { ILoggedUserInfo } from "src/modules/auth/interfaces/logged-user-info.interface";
import { IUploadedFile } from "src/modules/spaces/interfaces/file-upload.interface";
import { IImageUpload } from "src/modules/spaces/interfaces/image-upload.interface";
import { SpacesService } from "src/modules/spaces/spaces.service";
import { SpacesDestinationPath } from "src/modules/spaces/enums/spaces-folder-name.enum";

@Injectable()
export class UserProfileService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly spacesService: SpacesService
    // private readonly userService: UserService,
  ) {}

  private profileModel = this.databaseService.profile;

  async findByUserId(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Profile> {
    const prisma = tx || this.databaseService;
    const result = await prisma.profile.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
        companyLogos: true,
      },
    });

    return result;
  }

  async update(userId: string, data: UpdateUserProfileDto): Promise<Profile> {
    const result = await this.profileModel.update({
      where: {
        userId,
      },
      data,
    });
    return result;
  }

  async create(userId: string, data: UpdateUserProfileDto): Promise<Profile> {
    const result = await this.profileModel.create({
      data: {
        ...data,
        userId,
      },
    });
    return result;
  }

  async updateOrCreate(userId: string, data: UpdateUserProfileDto) {
    const update = await this.profileModel.upsert({
      where: {
        userId,
      },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
    const result = await this.profileModel.findUnique({
      where: {
        id: update.id,
      },
      include: {
        user: true,
      },
    });
    return result;
  }

  async uploadCompanyLogo(
    file: Express.Multer.File,
    loggedUserInfo: ILoggedUserInfo
  ) {
    let pdfFile: IImageUpload | null = null;
    try {
      if (file) {
        pdfFile = await this.spacesService.uploadSingleImage(
          file,
          SpacesDestinationPath.PROFILE
        );
      }
    } catch (error) {
      throw new BadRequestException("Something went wrong with file upload");
    }

    if (!pdfFile) throw new BadRequestException("Something went wrong");

    const result = await this.profileModel.update({
      where: {
        userId: loggedUserInfo.id,
      },
      data: {
        companyLogos: {
          create: {
            url: pdfFile.url,
            name: pdfFile.name,
            extension: pdfFile.extension,
            height: pdfFile.height,
            width: pdfFile.width,
            fileCreatedAt: pdfFile.createdAt,
            userId: loggedUserInfo.id,
          },
        },
      },
    });
    return result;
  }
}
