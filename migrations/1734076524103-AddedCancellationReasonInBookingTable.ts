import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCancellationReasonInBookingTable1734076524103 implements MigrationInterface {
    name = 'AddedCancellationReasonInBookingTable1734076524103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" RENAME COLUMN "isRatingPending" TO "cancellation_reason"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "cancellation_reason"`);
        await queryRunner.query(`CREATE TYPE "public"."booking_cancellation_reason_enum" AS ENUM('I don''t need this journey', 'I want to change the details of the journey', 'The driver took too long to be appointed', 'Other')`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "cancellation_reason" "public"."booking_cancellation_reason_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "cancellation_reason"`);
        await queryRunner.query(`DROP TYPE "public"."booking_cancellation_reason_enum"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "cancellation_reason" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "booking" RENAME COLUMN "cancellation_reason" TO "isRatingPending"`);
    }

}
