import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { access, mkdir } from 'fs/promises';
import { assetsPath } from '../../env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  try {
    await access(assetsPath);
  } catch (error) {
    await mkdir(assetsPath);
  }

  app.useStaticAssets(assetsPath, { prefix: '' });

  app.enableCors({
    origin: ['http://assets-fe.araden.top', 'https://assets-fe.araden.top'],
  });

  if (import.meta.env.PROD) await app.listen(10086);

  return app;
}

export const appServer = bootstrap();
