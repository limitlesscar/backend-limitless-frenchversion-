import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCarBookingStatusInCarEntity1733296159635 implements MigrationInterface {
    name = 'AddedCarBookingStatusInCarEntity1733296159635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" ADD "isBooked" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "isBooked"`);
    }

}
