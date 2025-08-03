import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddedCancellationReasonInBookingTable1734076524103 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
