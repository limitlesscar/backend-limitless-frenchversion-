"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedIsRatingPendingBoolInBookingTable1734075329997 = void 0;
class AddedIsRatingPendingBoolInBookingTable1734075329997 {
    constructor() {
        this.name = 'AddedIsRatingPendingBoolInBookingTable1734075329997';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "booking" ADD "isRatingPending" boolean NOT NULL DEFAULT true`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "isRatingPending"`);
    }
}
exports.AddedIsRatingPendingBoolInBookingTable1734075329997 = AddedIsRatingPendingBoolInBookingTable1734075329997;
//# sourceMappingURL=1734075329997-AddedIsRatingPendingBoolInBookingTable.js.map