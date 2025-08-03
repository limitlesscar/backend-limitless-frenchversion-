import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHostRelationWithCar1732891388885 implements MigrationInterface {
    name = 'CreateHostRelationWithCar1732891388885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" ADD "host_id" integer`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_56ca49347f5a7ef3856e9acc481" FOREIGN KEY ("host_id") REFERENCES "host"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_56ca49347f5a7ef3856e9acc481"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "host_id"`);
    }

}
