import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
const SWAGGER_UI_PATH = "docs";
const createSwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle("LIMITLESS APIs")
    .setDescription(
      "LIMITLESS back-end application written in NestJS using PostgreSQL and TypeORM.",
    )
    .setVersion("1.0.0")
    .addTag("LIMITLESS")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "Bearer Authorization",
    )
    .build();
const theme = new SwaggerTheme();
const themeOptions = {
  customCss: theme.getBuffer(SwaggerThemeNameEnum.FEELING_BLUE),
  swaggerOptions: {
    persistAuthorization: true,
  },
};
export function useSwagger(app: INestApplication): void {
  const config = createSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_UI_PATH, app, document, themeOptions);
}

// This code sets up Swagger (OpenAPI) documentation for the NestJS app.
// It defines the API metadata like title, description, version, tags, and JWT bearer auth.
// It applies a custom Swagger UI theme ("Feeling Blue") and enables persistent authorization.
// The exported `useSwagger` function configures and mounts the Swagger UI at the "/docs" route.
