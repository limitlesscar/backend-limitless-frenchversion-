"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dob = exports.numeric = exports.alphanumeric = exports.alphabetic = void 0;
exports.alphabetic = /^[a-zA-Z\s]+$/;
exports.alphanumeric = /^[a-zA-Z0-9\s]+$/;
exports.numeric = /^[0-9]+$/;
exports.dob = /^(0[1-9]|[12][0-9]|3[01])-(January|February|March|April|May|June|July|August|September|October|November|December)-(\d{4})$/;
//# sourceMappingURL=regex.js.map