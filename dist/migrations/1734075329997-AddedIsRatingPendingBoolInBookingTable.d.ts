import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddedIsRatingPendingBoolInBookingTable1734075329997 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
