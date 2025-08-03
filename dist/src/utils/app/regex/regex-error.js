"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numericError = exports.alphanumericError = exports.alphabeticError = void 0;
const common_type_1 = require("../../../types/common.type");
const alphabeticError = ({ property }) => `The field '${property}' ${common_type_1.RegexError.ALPHABETIC}`;
exports.alphabeticError = alphabeticError;
const alphanumericError = ({ property }) => `The field '${property}' ${common_type_1.RegexError.ALPHANUMERIC}`;
exports.alphanumericError = alphanumericError;
const numericError = ({ property }) => `The field '${property}' ${common_type_1.RegexError.NUMERIC}`;
exports.numericError = numericError;
//# sourceMappingURL=regex-error.js.map