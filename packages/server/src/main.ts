import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(session({ secret: "fuyuna", resave: true, saveUninitialized: true }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
