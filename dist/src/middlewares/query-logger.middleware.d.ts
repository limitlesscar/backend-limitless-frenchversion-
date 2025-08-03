import { QueryRunner, Logger as TypeORMLogger } from "typeorm";
export declare class QueryLogger implements TypeORMLogger {
    private readonly logger;
    logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner): void;
    logQueryError(error: string, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void;
    logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void;
    logMigration(message: string): void;
    logSchemaBuild(message: string): void;
    log(level: "log" | "info" | "warn", message: string, queryRunner?: QueryRunner): void;
    private stringifyParameters;
}
