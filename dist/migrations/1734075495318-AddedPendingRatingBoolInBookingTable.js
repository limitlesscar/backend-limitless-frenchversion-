"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedPendingRatingBoolInBookingTable1734075495318 = void 0;
class AddedPendingRatingBoolInBookingTable1734075495318 {
    constructor() {
        this.name = 'AddedPendingRatingBoolInBookingTable1734075495318';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "booking" ADD "is_rating_pending" boolean NOT NULL DEFAULT true`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "is_rating_pending"`);
    }
}
exports.AddedPendingRatingBoolInBookingTable1734075495318 = AddedPendingRatingBoolInBookingTable1734075495318;
//# sourceMappingURL=1734075495318-AddedPendingRatingBoolInBookingTable.js.map