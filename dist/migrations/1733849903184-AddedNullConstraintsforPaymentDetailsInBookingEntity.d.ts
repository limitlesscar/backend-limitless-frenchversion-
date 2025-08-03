import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddedNullConstraintsforPaymentDetailsInBookingEntity1733849903184 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
