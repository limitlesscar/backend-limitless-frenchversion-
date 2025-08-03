"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedNullConstraintsforPaymentDetailsInBookingEntity1733849903184 = void 0;
class AddedNullConstraintsforPaymentDetailsInBookingEntity1733849903184 {
    constructor() {
        this.name = 'AddedNullConstraintsforPaymentDetailsInBookingEntity1733849903184';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "card_last_four" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "card_brand" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "payment_method_id" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "payment_method_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "card_brand" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "card_last_four" SET NOT NULL`);
    }
}
exports.AddedNullConstraintsforPaymentDetailsInBookingEntity1733849903184 = AddedNullConstraintsforPaymentDetailsInBookingEntity1733849903184;
//# sourceMappingURL=1733849903184-AddedNullConstraintsforPaymentDetailsInBookingEntity.js.map