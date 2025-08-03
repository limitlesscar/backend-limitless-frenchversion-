"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const requestIp = require("request-ip");
const swagger_config_1 = require("./config/swagger.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
        bodyParser: true,
    });
    app.enableCors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://limitless-ap.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    (0, swagger_config_1.useSwagger)(app);
    common_1.Logger.log("App is bootstrapping...", "Bootstrap");
    app.use(requestIp.mw());
    const port = process.env.PORT || 8000;
    await app.listen(port);
    common_1.Logger.log(`🚀 Server is up and running on port ${port}`, "Bootstrap");
}
bootstrap();
//# sourceMappingURL=main.js.map