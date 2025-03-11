import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from "@nestjs/common";

@Injectable()
export class CompanyLogoSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const fiveMb = 5 * 1024 * 1024; //5mb
    const isValidSize = value.size < fiveMb;
    if (!isValidSize)
      throw new UnprocessableEntityException(
        "File size should be less than 5mb"
      );
    return value;
  }
}
