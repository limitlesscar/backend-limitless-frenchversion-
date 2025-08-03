import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddedPendingRatingBoolInBookingTable1734075495318 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
