import { NestFactory } from "@nestjs/core";
import { ConsoleLogger, VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: "Fuyuna",
      logLevels: ["error", "warn", "log"],
    }),
  });

  const config = new DocumentBuilder()
    .setTitle("Fuyuna API")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("/api", app, documentFactory);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(session({ secret: "fuyuna", resave: true, saveUninitialized: true }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
