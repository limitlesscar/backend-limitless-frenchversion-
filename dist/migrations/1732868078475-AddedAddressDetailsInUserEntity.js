"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedAddressDetailsInUserEntity1732868078475 = void 0;
class AddedAddressDetailsInUserEntity1732868078475 {
    constructor() {
        this.name = 'AddedAddressDetailsInUserEntity1732868078475';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "host" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "host" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "host" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "host" ADD "iban_number" character varying`);
        await queryRunner.query(`ALTER TABLE "host" ADD "bank_account_number" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "host" DROP COLUMN "bank_account_number"`);
        await queryRunner.query(`ALTER TABLE "host" DROP COLUMN "iban_number"`);
        await queryRunner.query(`ALTER TABLE "host" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "host" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "host" ADD "country" character varying`);
    }
}
exports.AddedAddressDetailsInUserEntity1732868078475 = AddedAddressDetailsInUserEntity1732868078475;
//# sourceMappingURL=1732868078475-AddedAddressDetailsInUserEntity.js.map