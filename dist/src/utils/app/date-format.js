"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatClockInTime = formatClockInTime;
exports.convertDateFormat = convertDateFormat;
function formatClockInTime(time) {
    let clockInTime;
    if (time instanceof Date) {
        clockInTime = time;
    }
    else if (typeof time === "string") {
        clockInTime = new Date(time);
    }
    else {
        throw new Error("Invalid clockInTime format");
    }
    const year = clockInTime.getFullYear().toString();
    const month = (clockInTime.getMonth() + 1).toString().padStart(2, "0");
    const day = clockInTime.getDate().toString().padStart(2, "0");
    const formattedDate = `${month}/${day}/${year}`;
    const hours = clockInTime.getHours().toString().padStart(2, "0");
    const minutes = clockInTime.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}${minutes}`;
    return {
        formattedDate: formattedDate,
        formattedTime: formattedTime,
    };
}
function convertDateFormat(dateStr) {
    const ddMmYyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(ddMmYyyyRegex);
    if (match) {
        return `${match[3]}-${match[2]}-${match[1]}`;
    }
    return dateStr;
}
//# sourceMappingURL=date-format.js.map