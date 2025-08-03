import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddedIsUnpublishedColumnInCar1733118012549 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
