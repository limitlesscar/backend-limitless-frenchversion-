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
exports.HostEntity = void 0;
const abstract_entity_1 = require("../../../database/abstract.entity");
const typeorm_1 = require("typeorm");
const car_entity_1 = require("../../car/entities/car.entity");
const booking_entity_1 = require("../../booking/entities/booking.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let HostEntity = class HostEntity extends abstract_entity_1.AbstractEntity {
};
exports.HostEntity = HostEntity;
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, unique: true }),
    __metadata("design:type", String)
], HostEntity.prototype, "stripe_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, unique: true }),
    __metadata("design:type", String)
], HostEntity.prototype, "stripe_link", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, unique: true }),
    __metadata("design:type", String)
], HostEntity.prototype, "dashboard_login_link", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity, (user) => user.host),
    (0, typeorm_1.JoinColumn)({ name: "user_id", referencedColumnName: "id" }),
    __metadata("design:type", user_entity_1.UserEntity)
], HostEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => car_entity_1.CarEntity, (car) => car.host),
    __metadata("design:type", Array)
], HostEntity.prototype, "cars", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.BookingEntity, (booking) => booking.host),
    __metadata("design:type", Array)
], HostEntity.prototype, "bookings", void 0);
exports.HostEntity = HostEntity = __decorate([
    (0, typeorm_1.Entity)("host")
], HostEntity);
//# sourceMappingURL=host.entity.js.map