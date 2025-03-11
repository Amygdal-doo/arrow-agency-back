import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  UnprocessableEntityException,
} from "@nestjs/common";

@Injectable()
export class ImageTypeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = value.originalname.slice(
      ((value.originalname.lastIndexOf(".") - 1) >>> 0) + 2
    );

    if (!allowedExtensions.includes(`.${fileExtension.toLowerCase()}`)) {
      throw new UnprocessableEntityException(
        "Invalid file type. Only image files are allowed."
      );
    }

    return value;
  }
}
