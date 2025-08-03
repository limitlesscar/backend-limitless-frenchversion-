import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAddressDetailsInUserEntity1732868078475 implements MigrationInterface {
    name = 'AddedAddressDetailsInUserEntity1732868078475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "host" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "host" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "host" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "host" ADD "iban_number" character varying`);
        await queryRunner.query(`ALTER TABLE "host" ADD "bank_account_number" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
