import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule } from '@nestjs/swagger';
import { configSwagger } from './config';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use helmet for security
  app.use(helmet());

  // enable cors
  app.enableCors();

  app.setGlobalPrefix('api' /*, { exclude: ['v1/some-route'] }*/);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  //Enabling swagger
  const document = SwaggerModule.createDocument(app, configSwagger, {
    //ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  await app.listen(PORT);
}
bootstrap();
