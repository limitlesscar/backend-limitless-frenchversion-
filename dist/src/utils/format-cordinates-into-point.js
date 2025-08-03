"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCoordinatesIntoPoint = formatCoordinatesIntoPoint;
exports.formatCoordinatesIntoObject = formatCoordinatesIntoObject;
function formatCoordinatesIntoPoint(long, lat) {
    return {
        type: "Point",
        coordinates: [long, lat],
    };
}
function formatCoordinatesIntoObject(coordinates) {
    return {
        lat: coordinates[1],
        long: coordinates[0],
    };
}
//# sourceMappingURL=format-cordinates-into-point.js.map