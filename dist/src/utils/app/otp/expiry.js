"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiryMilliSeconds = void 0;
const getExpiryMilliSeconds = (expiry) => {
    const unit = expiry.slice(-1);
    let time = 1;
    switch (unit) {
        case "s":
            time = 1000;
            break;
        case "m":
            time = 1000 * 60;
            break;
        case "h":
            time = 1000 * 60 * 60;
            break;
        case "d":
            time = 1000 * 60 * 60 * 24;
            break;
        default:
            time = 1000;
    }
    const value = parseInt(expiry.toString().slice(0, -1), 10);
    if (isNaN(value)) {
        return 1000 * 60 * 60 * 24;
    }
    return time * value;
};
exports.getExpiryMilliSeconds = getExpiryMilliSeconds;
//# sourceMappingURL=expiry.js.map