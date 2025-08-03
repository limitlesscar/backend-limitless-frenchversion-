"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedCancellationReasonInBookingTable1734076524103 = void 0;
class AddedCancellationReasonInBookingTable1734076524103 {
    constructor() {
        this.name = 'AddedCancellationReasonInBookingTable1734076524103';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "booking" RENAME COLUMN "isRatingPending" TO "cancellation_reason"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "cancellation_reason"`);
        await queryRunner.query(`CREATE TYPE "public"."booking_cancellation_reason_enum" AS ENUM('I don''t need this journey', 'I want to change the details of the journey', 'The driver took too long to be appointed', 'Other')`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "cancellation_reason" "public"."booking_cancellation_reason_enum"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "cancellation_reason"`);
        await queryRunner.query(`DROP TYPE "public"."booking_cancellation_reason_enum"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "cancellation_reason" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "booking" RENAME COLUMN "cancellation_reason" TO "isRatingPending"`);
    }
}
exports.AddedCancellationReasonInBookingTable1734076524103 = AddedCancellationReasonInBookingTable1734076524103;
//# sourceMappingURL=1734076524103-AddedCancellationReasonInBookingTable.js.map