"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
const fs = require("fs");
const path_1 = require("path");
(0, dotenv_1.config)({
    path: [".env"],
});
const configService = new config_1.ConfigService();
exports.default = new typeorm_1.DataSource({
    type: "postgres",
    host: configService.getOrThrow("POSTGRES_HOST"),
    port: configService.getOrThrow("POSTGRES_PORT"),
    username: configService.getOrThrow("POSTGRES_USER"),
    password: configService.getOrThrow("POSTGRES_PASSWORD"),
    database: configService.getOrThrow("POSTGRES_DATABASE"),
    ssl: {
        rejectUnauthorized: true,
        ca: fs
            .readFileSync((0, path_1.join)(process.cwd(), "src/modules", "database", "eu-west-3-bundle.pem"))
            .toString(),
    },
    migrations: ["migrations/**"],
    entities: ["dist/**/*.entity.js"],
});
//# sourceMappingURL=typeOrm.config.js.map