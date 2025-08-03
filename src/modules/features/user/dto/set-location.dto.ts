import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyObject, IsObject } from "class-validator";
import { Coordinates } from "src/types/common.type";

export class LocationDto {
  @ApiProperty({
    type: "object",
    properties: {
      lat: { type: "number", example: 12.9716 },
      long: { type: "number", example: 74.8756 },
    },
    description: "Geographical location with latitude and longitude",
  })
  @IsObject()
  // @IsNotEmptyObject()
  location: Coordinates;
}
