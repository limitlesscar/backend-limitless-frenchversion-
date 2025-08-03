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
exports.FilterCarDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const vehicle_type_enum_1 = require("../enums/vehicle-type.enum");
const class_validator_1 = require("class-validator");
const features_enum_1 = require("../enums/features.enum");
const transmission_type_enum_1 = require("../enums/transmission-type.enum");
const engine_type_enum_1 = require("../enums/engine-type.enum");
const brand_enum_1 = require("../enums/brand.enum");
const class_transformer_1 = require("class-transformer");
class FilterCarDto {
}
exports.FilterCarDto = FilterCarDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "vehicle_type",
        description: "Types of vehicle",
        isArray: true,
        required: false,
        example: [vehicle_type_enum_1.VehicleType.SPORTS_CAR, vehicle_type_enum_1.VehicleType.SUV],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(vehicle_type_enum_1.VehicleType, { each: true }),
    __metadata("design:type", Array)
], FilterCarDto.prototype, "vehicle_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "features",
        description: "Features of the car",
        required: false,
        isArray: true,
        example: [features_enum_1.CarFeatures.ANDROID_AUTO, features_enum_1.CarFeatures.AIR_CONDITIONING],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(features_enum_1.CarFeatures, { each: true }),
    __metadata("design:type", Array)
], FilterCarDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "minimum_seats",
        description: "Minimum number of seats in the car",
        required: false,
        example: 3,
    }),
    (0, class_validator_1.Min)(2, { message: "Minimum seats cannot be less than 2" }),
    (0, class_validator_1.Max)(20, { message: "Minimum seats cannot exceed the limit of 10" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FilterCarDto.prototype, "minimum_seats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "total_price",
        description: "Amount limit for the car in Euros",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: "Total price must be an integer" }),
    __metadata("design:type", Number)
], FilterCarDto.prototype, "total_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "less_than_five_years",
        description: "Age of the car",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "true" ? true : value === "false" ? false : value),
    (0, class_validator_1.IsBoolean)({ message: "less_than_five_years must be a boolean" }),
    __metadata("design:type", Boolean)
], FilterCarDto.prototype, "less_than_five_years", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "gearbox",
        description: "Gearbox type of the car",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(transmission_type_enum_1.TransmissionType),
    __metadata("design:type", String)
], FilterCarDto.prototype, "gearbox", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "engine_type",
        description: "Engine type of the car",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(engine_type_enum_1.EngineType),
    __metadata("design:type", String)
], FilterCarDto.prototype, "engine_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "brand",
        description: "Brand of the car",
        isArray: true,
        required: false,
        example: [brand_enum_1.CarBrand.AUDI, brand_enum_1.CarBrand.BMW, brand_enum_1.CarBrand.CHEVROLET],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(brand_enum_1.CarBrand, { each: true }),
    __metadata("design:type", Array)
], FilterCarDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "start_date_time",
        description: "Start date time of the booking",
        example: "2024-12-25T12:00:00Z",
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: "Start date time must be a string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterCarDto.prototype, "start_date_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "end_date_time",
        description: "End date time of the booking",
        example: "2024-12-25T12:00:00Z",
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: "End date time must be a string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterCarDto.prototype, "end_date_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "address",
        description: "Address of the user",
        example: "Ghulam Ishaq Khan Hall, University of Karachi",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterCarDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "skip",
        description: "Number of items to skip",
        example: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilterCarDto.prototype, "skip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "take",
        description: "Number of items to take",
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilterCarDto.prototype, "take", void 0);
//# sourceMappingURL=filter-car.dto.js.map