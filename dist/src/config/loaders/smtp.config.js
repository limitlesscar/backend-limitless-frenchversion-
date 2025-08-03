"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("smtp", () => ({
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
}));
//# sourceMappingURL=smtp.config.js.map