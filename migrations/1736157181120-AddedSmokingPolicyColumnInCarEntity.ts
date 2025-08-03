import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSmokingPolicyColumnInCarEntity1736157181120 implements MigrationInterface {
    name = 'AddedSmokingPolicyColumnInCarEntity1736157181120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" ADD "smoking_policy" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "smoking_policy"`);
    }

}
