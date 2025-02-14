import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [OpenaiController],
  providers: [
    OpenaiService,
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.getOrThrow<string>('OPENAI_API_KEY');
        return new OpenAI({ apiKey });
      },
      inject: [ConfigService],
    },
  ],
  exports: [OpenaiService],
})
export class OpenaiModule {}
