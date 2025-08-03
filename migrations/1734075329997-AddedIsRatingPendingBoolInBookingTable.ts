import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsRatingPendingBoolInBookingTable1734075329997 implements MigrationInterface {
    name = 'AddedIsRatingPendingBoolInBookingTable1734075329997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "isRatingPending" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "isRatingPending"`);
    }

}
