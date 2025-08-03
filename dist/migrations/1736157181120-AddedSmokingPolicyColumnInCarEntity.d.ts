import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddedSmokingPolicyColumnInCarEntity1736157181120 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
