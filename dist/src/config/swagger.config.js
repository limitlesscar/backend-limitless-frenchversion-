"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSwagger = useSwagger;
const swagger_1 = require("@nestjs/swagger");
const swagger_themes_1 = require("swagger-themes");
const SWAGGER_UI_PATH = "docs";
const createSwaggerConfig = () => new swagger_1.DocumentBuilder()
    .setTitle("LIMITLESS APIs")
    .setDescription("LIMITLESS back-end application written in NestJS using PostgreSQL and TypeORM.")
    .setVersion("1.0.0")
    .addTag("LIMITLESS")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "Bearer Authorization")
    .build();
const theme = new swagger_themes_1.SwaggerTheme();
const themeOptions = {
    customCss: theme.getBuffer(swagger_themes_1.SwaggerThemeNameEnum.FEELING_BLUE),
    swaggerOptions: {
        persistAuthorization: true,
    },
};
function useSwagger(app) {
    const config = createSwaggerConfig();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(SWAGGER_UI_PATH, app, document, themeOptions);
}
//# sourceMappingURL=swagger.config.js.map