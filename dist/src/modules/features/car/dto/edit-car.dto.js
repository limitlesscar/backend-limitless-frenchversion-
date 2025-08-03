"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCarDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const register_car_dto_1 = require("./register-car.dto");
class EditCarDto extends (0, swagger_1.PartialType)(register_car_dto_1.RegisterCarDto) {
}
exports.EditCarDto = EditCarDto;
//# sourceMappingURL=edit-car.dto.js.map