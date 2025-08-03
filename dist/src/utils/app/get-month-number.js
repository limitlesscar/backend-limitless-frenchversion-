"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthNumber = void 0;
const getMonthNumber = (month) => {
    const months = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
    };
    return months[month];
};
exports.getMonthNumber = getMonthNumber;
//# sourceMappingURL=get-month-number.js.map