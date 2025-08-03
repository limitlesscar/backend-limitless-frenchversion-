import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsUnpublishedColumnInCar1733118012549 implements MigrationInterface {
    name = 'AddedIsUnpublishedColumnInCar1733118012549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" ADD "is_unpublished" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "is_unpublished"`);
    }

}
