import { S3ClientConfig } from "@aws-sdk/client-s3";
import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot();

export const S3_CLIENT_CONFIG: S3ClientConfig = {
  forcePathStyle: true, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.OBJECT_STORAGE_URL,
  region: process.env.OBJECT_STORAGE_REGION,
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
};

export const BUCKET = process.env.OBJECT_STORAGE_BUCKET;
export const HOME_DIR = "arrowAgency";
export const OBJECT_STORAGE_URL = process.env.OBJECT_STORAGE_URL;
export const OBJECT_STORAGE_ORIGIN_URL = process.env.OBJECT_STORAGE_ORIGIN_URL;
export const SPACES_URL_CREATION =
  OBJECT_STORAGE_URL + "/" + BUCKET + "/" + HOME_DIR;
export const SPACES_URL_ORIGIN = OBJECT_STORAGE_ORIGIN_URL;
