import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { extname } from "path";
import {
  S3,
  DeleteObjectsCommand,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectsCommandInput,
} from "@aws-sdk/client-s3";
import { S3_CLIENT } from "./constants";
import { IUploadedFile } from "./interfaces/file-upload.interface";
import { SpacesDestinationPath } from "./enums/spaces-folder-name.enum";
import {
  BUCKET,
  HOME_DIR,
  OBJECT_STORAGE_ORIGIN_URL,
  OBJECT_STORAGE_URL,
  SPACES_URL_CREATION,
} from "./config/spaces.config";
import { IImageUpload } from "./interfaces/image-upload.interface";
import * as sharp from "sharp";

@Injectable()
export class SpacesService {
  constructor(@Inject(S3_CLIENT) private readonly s3: S3) {}

  private async getMetadata(buffer: Buffer): Promise<sharp.Metadata> {
    try {
      const metadata = await sharp(buffer).metadata();
      return metadata;
    } catch (error) {
      throw new BadRequestException("Image processing error");
    }
  }

  private removeBlanks(text: string): string {
    return text.replace(/\s/g, "");
  }

  async uploadSinglePdf(
    pdf: Express.Multer.File,
    destinationPath: SpacesDestinationPath
  ): Promise<IUploadedFile> {
    const ext = extname(pdf?.originalname);
    if (ext !== ".pdf") {
      throw new HttpException("Invalid file format.", HttpStatus.BAD_REQUEST);
    }
    const name = this.removeBlanks(pdf?.originalname);
    const fileName = `${HOME_DIR}/${destinationPath}/${Date.now()}-${name}`;

    return new Promise<IUploadedFile>((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: BUCKET,
          Key: fileName,
          Body: pdf.buffer,
          ACL: "public-read",
        },
        (error: any /*AWS.AWSError*/) => {
          if (!error) {
            const url = `${SPACES_URL_CREATION}/${fileName}`;
            const createdAt = new Date();
            resolve({
              name: name,
              extension: ext,
              createdAt,
              url,
            });
          } else {
            reject(
              new Error(
                `SpacesService_ERROR: ${error || "Something went wrong"}`
              )
            );
          }
        }
      );
    });
  }

  async uploadFileBuffer(
    fileBuffer: Buffer,
    fileName: string,
    destinationPath: SpacesDestinationPath,
    extension: string = ".pdf" // Default to .pdf if not provided
  ): Promise<IUploadedFile> {
    if (!fileBuffer) {
      throw new HttpException(
        "File buffer is required.",
        HttpStatus.BAD_REQUEST
      );
    }
    const name = this.removeBlanks(fileName);
    const fullFileName = `${HOME_DIR}/${destinationPath}/${Date.now()}-${name}`;

    return new Promise<IUploadedFile>((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: BUCKET,
          Key: fullFileName,
          Body: fileBuffer,
          ACL: "public-read",
        },
        (error: any /*AWS.AWSError*/) => {
          if (!error) {
            const url = `${SPACES_URL_CREATION}/${fullFileName}`;
            const createdAt = new Date();
            resolve({
              name: name,
              extension,
              createdAt,
              url,
            });
          } else {
            reject(
              new Error(
                `SpacesService_ERROR: ${error || "Something went wrong"}`
              )
            );
          }
        }
      );
    });
  }

  async uploadSingleFile(
    file: Express.Multer.File,
    destinationPath: SpacesDestinationPath
  ) {
    const ext = extname(file.originalname);
    if (ext !== ".txt" && ext !== ".pdf" && ext !== ".doc" && ext !== ".docx") {
      throw new HttpException("Invalid file format.", HttpStatus.BAD_REQUEST);
    }
    const name = this.removeBlanks(file?.originalname);
    const fileName =
      HOME_DIR + "/" + destinationPath + `/files/${Date.now()}-${name}`;
    return new Promise<IUploadedFile>((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: BUCKET,
          Key: fileName,
          Body: file.buffer,
          ACL: "public-read",
        },
        (error: any /*AWS.AWSError*/) => {
          if (!error) {
            const url = `${SPACES_URL_CREATION}/${fileName}`;
            const createdAt = new Date();
            resolve({
              name: name,
              extension: ext,
              createdAt,
              url,
            });
          } else {
            reject(
              new Error(
                `SpacesService_ERROR: ${
                  error.message || "Something went wrong"
                }`
              )
            );
          }
        }
      );
    });
  }

  async uploadSingleImage(
    file: Express.Multer.File,
    destinationPath: SpacesDestinationPath
  ) {
    const ext = extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      throw new HttpException("Invalid file format.", HttpStatus.BAD_REQUEST);
    }

    const name = this.removeBlanks(file?.originalname);
    const fileName =
      HOME_DIR + "/" + destinationPath + `/images/${Date.now()}-${name}`;
    const imageBuffer = file.buffer;
    // const imageType = ext.slice(1);
    const imageMetadata = await this.getMetadata(imageBuffer);
    const imageWidth = imageMetadata.width;
    const imageHeight = imageMetadata.height;
    return new Promise<IImageUpload>((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: BUCKET,
          Key: fileName,
          Body: file.buffer,
          ACL: "public-read",
        },
        (error: any /*AWS.AWSError*/) => {
          if (!error) {
            const url = `${SPACES_URL_CREATION}/${fileName}`;
            const createdAt = new Date();
            resolve({
              height: imageHeight,
              width: imageWidth,
              name: name,
              extension: ext,
              createdAt,
              url,
            });
          } else {
            reject(
              new Error(
                `SpacesService_ERROR: ${
                  error.message || "Something went wrong"
                }`
              )
            );
          }
        }
      );
    });
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    destinationPath: SpacesDestinationPath
  ) {
    const promises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const ext = extname(file.originalname);
          if (
            ext !== ".txt" &&
            ext !== ".pdf" &&
            ext !== ".doc" &&
            ext !== ".docx"
          ) {
            throw new HttpException(
              "Invalid file format.",
              HttpStatus.BAD_REQUEST
            );
          }
          const fileName =
            HOME_DIR +
            "/" +
            destinationPath +
            `/files/${Date.now()}-${file.originalname}`;
          this.s3.putObject(
            {
              Bucket: BUCKET,
              Key: fileName,
              Body: file.buffer,
              ACL: "public-read",
            },
            (error: any /*AWS.AWSError*/) => {
              if (!error) {
                const url = `${OBJECT_STORAGE_ORIGIN_URL}/${fileName}`;
                const createdAt = new Date();
                resolve({
                  name: file.originalname,
                  extension: ext,
                  createdAt,
                  url,
                });
              } else {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
              }
            }
          );
        })
    );
    return Promise.all(promises).then((links: IUploadedFile[]) => {
      return links;
    });
  }

  // private async getMetadata(buffer: Buffer): Promise<sharp.Metadata> {
  //   try {
  //     const metadata = await sharp(buffer).metadata();
  //     return metadata;
  //   } catch (error) {
  //     throw new BadReqException('Image processing error');
  //   }
  // }

  async uploadMultipleImages(
    images: Express.Multer.File[],
    destinationPath: SpacesDestinationPath
  ) {
    const promises = images.map(
      (image) =>
        new Promise((resolve, reject) => {
          const ext = extname(image.originalname);
          if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            throw new HttpException(
              "Invalid file format.",
              HttpStatus.BAD_REQUEST
            );
          }
          const fileName =
            HOME_DIR +
            "/" +
            destinationPath +
            `/images/${Date.now()}-${image.originalname}`;
          this.s3.putObject(
            {
              Bucket: BUCKET,
              Key: fileName,
              Body: image.buffer,
              ACL: "public-read",
            },
            (error: any /*AWS.AWSError*/) => {
              if (!error) {
                const url = `${OBJECT_STORAGE_ORIGIN_URL}/${fileName}`;
                const createdAt = new Date();
                resolve({
                  name: image.originalname,
                  extension: ext,
                  createdAt,
                  url,
                });
              } else {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
              }
            }
          );
        })
    );
    return Promise.all(promises).then((links: IUploadedFile[]) => {
      return links;
    });
  }

  async deleteFiles(files: IUploadedFile[]) {
    files.forEach((file) => {
      const key = file.url.slice(53);
      this.s3.deleteObject({ Bucket: BUCKET, Key: key }, (err, data) => {
        if (err) {
          console.error(err);
          console.log(data);
        }
      });
    });
  }

  // async deleteFilesByURL(links: string[]) {
  //   links.forEach((link) => {
  //     const key = link.slice(OBJECT_STORAGE_URL.length + 1);
  //     console.log({key});

  //     this.s3.deleteObject(
  //       { Bucket: BUCKET, Key: key },
  //       (err, data) => {
  //         if (err) {
  //           console.error(err);
  //           console.log(data);
  //         }
  //       },
  //     );
  //   });
  // }

  async deleteFilesByURL(keys: string[]) {
    try {
      const keysArray = [];
      keys.map((key) =>
        keysArray.push({
          Key: key.slice(OBJECT_STORAGE_ORIGIN_URL.length + 1),
        })
      );
      const deleteParams: DeleteObjectsCommandInput = {
        Bucket: BUCKET,
        Delete: {
          Objects: keysArray,
          // Quiet: false,
        },
      };

      const command = new DeleteObjectsCommand(deleteParams);
      const data = await this.s3.send(command).catch((err) => {
        console.log(err);
      });
      return data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new InternalServerErrorException();
    }
  }

  async deleteFileByURL(url: string) {
    try {
      const key = url.slice(OBJECT_STORAGE_URL.length + 1);

      const deleteParams: DeleteObjectCommandInput = {
        Bucket: BUCKET,
        Key: key,
      };

      const command = new DeleteObjectCommand(deleteParams);
      const data = await this.s3.send(command).catch((err) => {
        console.log(err);
      });
      return data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new InternalServerErrorException();
    }
  }

  async uploadVideoOrImage(
    image: Express.Multer.File,
    destinationPath: SpacesDestinationPath
  ) {
    const ext = extname(image.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".mp4") {
      throw new HttpException("Invalid file format.", HttpStatus.BAD_REQUEST);
    }

    const fileName =
      ext !== ".mp4"
        ? destinationPath + `/images/${Date.now()}-${image.originalname}`
        : destinationPath + `/videos/${Date.now()}-${image.originalname}`;
    return new Promise<IUploadedFile>((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: BUCKET,
          Key: fileName,
          Body: image.buffer,
          ACL: "public-read",
        },
        (error: any /*AWS.AWSError*/) => {
          if (!error) {
            const url = `${OBJECT_STORAGE_ORIGIN_URL}/${fileName}`;
            const createdAt = new Date();
            resolve({
              name: image.originalname,
              extension: ext,
              createdAt,
              url,
            });
          } else {
            reject(
              new Error(
                `SpacesService_ERROR: ${
                  error.message || "Something went wrong"
                }`
              )
            );
          }
        }
      );
    });
  }

  async uploadVideoOrImageOrAudio(
    media: Express.Multer.File,
    destinationPath: SpacesDestinationPath
  ) {
    const ext = extname(media.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".mp4" &&
      ext != ".mp3" &&
      ext != ".aac"
    ) {
      throw new HttpException("Invalid file format.", HttpStatus.BAD_REQUEST);
    }
    let fileName: string;
    switch (ext) {
      case ".mp3":
        fileName =
          HOME_DIR +
          "/" +
          destinationPath +
          `/audio/${Date.now()}-${media.originalname}`;
        break;
      case ".mp4":
        fileName =
          HOME_DIR +
          "/" +
          destinationPath +
          `/videos/${Date.now()}-${media.originalname}`;
        break;
      case ".aac":
        fileName =
          HOME_DIR +
          "/" +
          destinationPath +
          `/audio/${Date.now()}-${media.originalname}`;
        break;
      default:
        fileName =
          HOME_DIR +
          "/" +
          destinationPath +
          `/images/${Date.now()}-${media.originalname}`;
        break;
    }
    return new Promise<IUploadedFile>((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: BUCKET,
          Key: fileName,
          Body: media.buffer,
          ACL: "public-read",
        },
        (error: any /*AWS.AWSError*/) => {
          if (!error) {
            const url = `${OBJECT_STORAGE_ORIGIN_URL}/${fileName}`;
            const createdAt = new Date();
            resolve({
              name: media.originalname,
              extension: ext,
              createdAt,
              url,
            });
          } else {
            reject(
              new Error(
                `SpacesService_ERROR: ${
                  error.message || "Something went wrong"
                }`
              )
            );
          }
        }
      );
    });
  }

  async uploadMultipleVideoOrImageOrAudio(
    files: Express.Multer.File[],
    destinationPath: SpacesDestinationPath
  ) {
    const promises = files.map(
      async (media) =>
        await this.uploadVideoOrImageOrAudio(media, destinationPath)
    );
    return Promise.all(promises);
  }
}
