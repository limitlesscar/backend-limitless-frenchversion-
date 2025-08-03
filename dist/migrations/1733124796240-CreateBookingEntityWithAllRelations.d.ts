import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateBookingEntityWithAllRelations1733124796240 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
