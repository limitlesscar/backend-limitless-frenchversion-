"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class RejectUserDto {
}
exports.RejectUserDto = RejectUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "id",
        description: "Id of the user to be rejected",
        example: 1,
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Id is required" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], RejectUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "rejection_reason",
        description: "Reason for rejecting the user",
        example: "User is not eligible",
        required: true,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Reason is required" }),
    (0, class_validator_1.IsString)({ message: "Reason must be a string" }),
    __metadata("design:type", String)
], RejectUserDto.prototype, "rejection_reason", void 0);
//# sourceMappingURL=reject-user.dto.js.map