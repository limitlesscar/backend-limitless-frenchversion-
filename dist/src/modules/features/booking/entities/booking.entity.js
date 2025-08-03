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
exports.BookingEntity = void 0;
const abstract_entity_1 = require("../../../database/abstract.entity");
const typeorm_1 = require("typeorm");
const booking_status_enum_1 = require("../enums/booking-status.enum");
const user_entity_1 = require("../../user/entities/user.entity");
const car_entity_1 = require("../../car/entities/car.entity");
const host_entity_1 = require("../../host/entities/host.entity");
const cancellation_reasons_enum_1 = require("../enums/cancellation-reasons.enum");
let BookingEntity = class BookingEntity extends abstract_entity_1.AbstractEntity {
};
exports.BookingEntity = BookingEntity;
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], BookingEntity.prototype, "stars", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], BookingEntity.prototype, "review_message", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], BookingEntity.prototype, "start_date_time", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], BookingEntity.prototype, "end_date_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BookingEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], BookingEntity.prototype, "card_last_four", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], BookingEntity.prototype, "card_brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], BookingEntity.prototype, "payment_method_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], BookingEntity.prototype, "stripe_fees", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], BookingEntity.prototype, "stripe_charge_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], BookingEntity.prototype, "transfer_group", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: booking_status_enum_1.BookingStatus, default: booking_status_enum_1.BookingStatus.ONGOING }),
    __metadata("design:type", String)
], BookingEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], BookingEntity.prototype, "is_rating_pending", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], BookingEntity.prototype, "is_refunded", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: cancellation_reasons_enum_1.BookingCancellationReason, nullable: true }),
    __metadata("design:type", String)
], BookingEntity.prototype, "cancellation_reason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.bookings),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.JoinColumn)({ name: "user_id", referencedColumnName: "id" }),
    __metadata("design:type", user_entity_1.UserEntity)
], BookingEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => host_entity_1.HostEntity, (host) => host.bookings),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.JoinColumn)({ name: "host_id", referencedColumnName: "id" }),
    __metadata("design:type", host_entity_1.HostEntity)
], BookingEntity.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => car_entity_1.CarEntity, (car) => car.bookings),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.JoinColumn)({ name: "car_id", referencedColumnName: "id" }),
    __metadata("design:type", car_entity_1.CarEntity)
], BookingEntity.prototype, "car", void 0);
exports.BookingEntity = BookingEntity = __decorate([
    (0, typeorm_1.Entity)("booking")
], BookingEntity);
//# sourceMappingURL=booking.entity.js.map