import { Point, Position } from "geojson";
import { Coordinates } from "src/types/common.type";
export function formatCoordinatesIntoPoint(long: number, lat: number): Point {
  return {
    type: "Point",
    coordinates: [long, lat],
  };
}
export function formatCoordinatesIntoObject(
  coordinates: Position
): Coordinates {
  return {
    lat: coordinates[1],
    long: coordinates[0],
  };
}
