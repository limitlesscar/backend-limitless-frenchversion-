import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPendingRatingBoolInBookingTable1734075495318 implements MigrationInterface {
    name = 'AddedPendingRatingBoolInBookingTable1734075495318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "is_rating_pending" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "is_rating_pending"`);
    }

}
