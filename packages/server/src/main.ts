import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { CodeToStatusInterceptor } from './common/Interceptor/code_to_status.interceptor';
import { portConfig } from '@fuyuna/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Fuyuna',
      logLevels: ['error', 'warn', 'log'],
    }),
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(session({ secret: 'fuyuna', resave: true, saveUninitialized: true }));
  app.useGlobalInterceptors(new CodeToStatusInterceptor());

  await app.listen(portConfig.getNestPortConfig());
}
void bootstrap();
