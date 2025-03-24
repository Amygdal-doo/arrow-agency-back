// file-extension.validator.ts
import { FileValidator } from "@nestjs/common";

export interface FileExtensionValidatorOptions {
  allowedExtensions: string[];
}

export class FileExtensionValidator extends FileValidator<FileExtensionValidatorOptions> {
  constructor(options: FileExtensionValidatorOptions) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean {
    if (!file) return true;
    const extension = file.originalname.split(".").pop().toLowerCase();
    return this.validationOptions.allowedExtensions.includes(extension);
  }

  buildErrorMessage(): string {
    return `Allowed file extensions: ${this.validationOptions.allowedExtensions.join(", ")}`;
  }
}
