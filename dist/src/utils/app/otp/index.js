"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRULY_RANDOM_OTP = exports.ALPHANUMERIC_OTP = exports.NUMERICAL_OTP = exports.generateOTP = void 0;
const OTP = require("otp-generator");
const generateOTP = ({ length, options, }) => {
    return OTP.generate(length, options);
};
exports.generateOTP = generateOTP;
exports.NUMERICAL_OTP = {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false,
};
exports.ALPHANUMERIC_OTP = {
    digits: true,
    lowerCaseAlphabets: true,
    specialChars: false,
    upperCaseAlphabets: true,
};
exports.TRULY_RANDOM_OTP = {
    digits: true,
    lowerCaseAlphabets: true,
    specialChars: true,
    upperCaseAlphabets: true,
};
//# sourceMappingURL=index.js.map