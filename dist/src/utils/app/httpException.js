"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwHttpException = void 0;
const common_1 = require("@nestjs/common");
const throwHttpException = (messages, status, errorType) => {
    const response = {
        message: messages,
        error: errorType,
        statusCode: status,
    };
    throw new common_1.HttpException({ ...response }, status);
};
exports.throwHttpException = throwHttpException;
//# sourceMappingURL=httpException.js.map