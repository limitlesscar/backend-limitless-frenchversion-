"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt = require("bcrypt");
function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}
function comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
}
//# sourceMappingURL=bcrypt.js.map