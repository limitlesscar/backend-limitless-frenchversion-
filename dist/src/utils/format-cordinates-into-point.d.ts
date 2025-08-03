import { Point, Position } from "geojson";
import { Coordinates } from "src/types/common.type";
export declare function formatCoordinatesIntoPoint(long: number, lat: number): Point;
export declare function formatCoordinatesIntoObject(coordinates: Position): Coordinates;
