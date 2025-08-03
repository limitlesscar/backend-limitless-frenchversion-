"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateStringToDate = void 0;
const date_fns_1 = require("date-fns");
const dateStringToDate = (dateString) => (0, date_fns_1.parse)(dateString, "dd-MMMM-yyyy", new Date());
exports.dateStringToDate = dateStringToDate;
//# sourceMappingURL=string-to-date.js.map