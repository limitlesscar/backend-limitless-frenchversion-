"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDate = convertToDate;
exports.addHoursToDate = addHoursToDate;
exports.subtractHoursToDate = subtractHoursToDate;
exports.formatDate = formatDate;
exports.formatTime = formatTime;
function convertToDate(dateString) {
    const dateParts = dateString.split(" ");
    const timeParts = dateParts[4].split(":");
    const year = dateParts[3];
    const month = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(dateParts[1]) / 3 +
        1)
        .toString()
        .padStart(2, "0");
    const day = dateParts[2].padStart(2, "0");
    const hours = timeParts[0].padStart(2, "0");
    const minutes = timeParts[1].padStart(2, "0");
    const seconds = timeParts[2].padStart(2, "0");
    const milliseconds = "000";
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    const dateObj = new Date(formattedDate);
    return dateObj;
}
function addHoursToDate(date, hoursToAdd) {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }
    date.setHours(date.getHours() + hoursToAdd);
    return date;
}
function subtractHoursToDate(date, hoursToAdd) {
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }
    date.setHours(date.getHours() - hoursToAdd);
    return date;
}
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}
//# sourceMappingURL=convertDate.js.map