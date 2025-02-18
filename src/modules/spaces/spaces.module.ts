import { S3, S3ClientConfig } from '@aws-sdk/client-s3';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { S3_CLIENT } from './constants';
import { SpacesService } from './spaces.service';
@Global()
@Module({
  providers: [SpacesService],
  exports: [SpacesService],
})
export class SpacesModule {
  static forRoot(s3ClientConfig: S3ClientConfig): DynamicModule {
    const s3Client = new S3(s3ClientConfig);
    const spacesProvider: Provider = {
      provide: S3_CLIENT,
      useValue: s3Client,
    };
    return {
      module: SpacesModule,
      providers: [spacesProvider],
      exports: [spacesProvider],
      // global: true
    };
  }
}
