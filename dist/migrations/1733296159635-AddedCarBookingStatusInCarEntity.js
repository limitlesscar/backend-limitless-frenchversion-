"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedCarBookingStatusInCarEntity1733296159635 = void 0;
class AddedCarBookingStatusInCarEntity1733296159635 {
    constructor() {
        this.name = 'AddedCarBookingStatusInCarEntity1733296159635';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "car" ADD "isBooked" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "isBooked"`);
    }
}
exports.AddedCarBookingStatusInCarEntity1733296159635 = AddedCarBookingStatusInCarEntity1733296159635;
//# sourceMappingURL=1733296159635-AddedCarBookingStatusInCarEntity.js.map