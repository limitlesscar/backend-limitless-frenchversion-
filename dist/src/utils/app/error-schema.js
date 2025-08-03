"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSchema = void 0;
const errorSchema = (statusCode, message) => ({
    type: "object",
    example: {
        statusCode,
        message: message || "Message d'erreur",
    },
});
exports.errorSchema = errorSchema;
//# sourceMappingURL=error-schema.js.map