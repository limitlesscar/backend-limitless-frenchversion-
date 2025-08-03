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
exports.CarEntity = void 0;
const abstract_entity_1 = require("../../../database/abstract.entity");
const typeorm_1 = require("typeorm");
const brand_enum_1 = require("../enums/brand.enum");
const vehicle_type_enum_1 = require("../enums/vehicle-type.enum");
const engine_type_enum_1 = require("../enums/engine-type.enum");
const transmission_type_enum_1 = require("../enums/transmission-type.enum");
const features_enum_1 = require("../enums/features.enum");
const booking_entity_1 = require("../../booking/entities/booking.entity");
const host_entity_1 = require("../../host/entities/host.entity");
let CarEntity = class CarEntity extends abstract_entity_1.AbstractEntity {
};
exports.CarEntity = CarEntity;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], CarEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", array: true }),
    __metadata("design:type", Array)
], CarEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: brand_enum_1.CarBrand }),
    __metadata("design:type", String)
], CarEntity.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], CarEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CarEntity.prototype, "price_per_day", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CarEntity.prototype, "price_per_hour", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: vehicle_type_enum_1.VehicleType }),
    __metadata("design:type", String)
], CarEntity.prototype, "vehicle_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], CarEntity.prototype, "country_of_manufacture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], CarEntity.prototype, "city_of_registeration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], CarEntity.prototype, "color_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CarEntity.prototype, "mileage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: engine_type_enum_1.EngineType }),
    __metadata("design:type", String)
], CarEntity.prototype, "engine_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: transmission_type_enum_1.TransmissionType,
    }),
    __metadata("design:type", String)
], CarEntity.prototype, "transmission_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CarEntity.prototype, "fuel_economy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], CarEntity.prototype, "available_start_date_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], CarEntity.prototype, "available_end_date_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], CarEntity.prototype, "pickup_address", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        type: "geography",
        spatialFeatureType: "Point",
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], CarEntity.prototype, "pickup_location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], CarEntity.prototype, "dropoff_address", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        type: "geography",
        spatialFeatureType: "Point",
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], CarEntity.prototype, "dropoff_location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: features_enum_1.CarFeatures, array: true }),
    __metadata("design:type", Array)
], CarEntity.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CarEntity.prototype, "maximum_passengers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CarEntity.prototype, "luggage_capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], CarEntity.prototype, "insurance_included", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], CarEntity.prototype, "pet_policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], CarEntity.prototype, "smoking_policy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], CarEntity.prototype, "is_unpublished", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], CarEntity.prototype, "isBooked", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], CarEntity.prototype, "is_verified", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => host_entity_1.HostEntity, (host) => host.cars),
    (0, typeorm_1.JoinColumn)({ name: "host_id" }),
    __metadata("design:type", host_entity_1.HostEntity)
], CarEntity.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.BookingEntity, (booking) => booking.car),
    __metadata("design:type", Array)
], CarEntity.prototype, "bookings", void 0);
exports.CarEntity = CarEntity = __decorate([
    (0, typeorm_1.Entity)("car")
], CarEntity);
//# sourceMappingURL=car.entity.js.map