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
exports.AddReviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class AddReviewDto {
}
exports.AddReviewDto = AddReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ name: "booking_id", required: true, example: 1 }),
    (0, class_validator_1.IsNumber)({}, { message: "Booking Id must be of type number" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Booking Id must not be empty" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AddReviewDto.prototype, "booking_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "stars", required: true, example: 4 }),
    (0, class_validator_1.IsNumber)({}, { message: "Stars must be of type number" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Stars must not be empty" }),
    (0, class_validator_1.Min)(1, { message: "Stars should atleast be 1" }),
    (0, class_validator_1.Max)(5, { message: "Stars cannot exceed the limit of 5" }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AddReviewDto.prototype, "stars", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "review_message",
        required: true,
        example: "Car was comfortable, will surely book again",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Review message must not be empty" }),
    (0, class_validator_1.IsString)({ message: "Review Message should be of type string" }),
    __metadata("design:type", String)
], AddReviewDto.prototype, "review_message", void 0);
//# sourceMappingURL=add-review.dto.js.map