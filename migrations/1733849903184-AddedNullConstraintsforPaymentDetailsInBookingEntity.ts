import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNullConstraintsforPaymentDetailsInBookingEntity1733849903184 implements MigrationInterface {
    name = 'AddedNullConstraintsforPaymentDetailsInBookingEntity1733849903184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "card_last_four" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "card_brand" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "payment_method_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "payment_method_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "card_brand" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "card_last_four" SET NOT NULL`);
    }

}
