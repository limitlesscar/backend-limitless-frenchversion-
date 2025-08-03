"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimMiddleware = void 0;
class TrimMiddleware {
    use(req, _res, next) {
        const requestBody = req.body;
        if (this.isObj(requestBody)) {
            req.body = this.trim(requestBody);
        }
        next();
    }
    isObj(obj) {
        return typeof obj === "object" && obj !== null;
    }
    trim(value) {
        if (typeof value === "string") {
            return value.trim();
        }
        if (Array.isArray(value)) {
            value.forEach((element, index) => {
                value[index] = this.trim(element);
            });
            return value;
        }
        if (this.isObj(value)) {
            Object.keys(value).forEach((key) => {
                value[key] = this.trim(value[key]);
            });
            return value;
        }
        return value;
    }
}
exports.TrimMiddleware = TrimMiddleware;
//# sourceMappingURL=trim-body.middleware.js.map