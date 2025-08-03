"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let HTTPLoggerMiddleware = class HTTPLoggerMiddleware {
    constructor() {
        this.logger = new common_1.Logger("HTTP");
    }
    use(request, response, next) {
        response.on("finish", () => {
            const { method, originalUrl, ip: ip_address } = request;
            const { statusCode, statusMessage } = response;
            const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;
            if (statusCode >= 500) {
                return this.logger.error({ message, ip_address });
            }
            else if (statusCode >= 400) {
                return this.logger.warn({ message, ip_address });
            }
            return this.logger.log({ message, ip_address });
        });
        next();
    }
};
exports.HTTPLoggerMiddleware = HTTPLoggerMiddleware;
exports.HTTPLoggerMiddleware = HTTPLoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], HTTPLoggerMiddleware);
//# sourceMappingURL=http-logger.middleware.js.map