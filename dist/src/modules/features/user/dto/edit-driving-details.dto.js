"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditDrivingDetailsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const driving_details_dto_1 = require("./driving-details.dto");
class EditDrivingDetailsDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(driving_details_dto_1.DrivingDetailsDto, ["license_image", "license_number"])) {
}
exports.EditDrivingDetailsDto = EditDrivingDetailsDto;
//# sourceMappingURL=edit-driving-details.dto.js.map