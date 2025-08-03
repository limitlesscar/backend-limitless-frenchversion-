"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryLogger = void 0;
const common_1 = require("@nestjs/common");
class QueryLogger {
    constructor() {
        this.logger = new common_1.Logger("SQL");
    }
    logQuery(query, parameters, queryRunner) {
        if (queryRunner?.data?.isCreatingLogs)
            return;
        this.logger.log(`${query} -- Parameters: ${this.stringifyParameters(parameters)}`);
    }
    logQueryError(error, query, parameters, queryRunner) {
        if (queryRunner?.data?.isCreatingLogs) {
            return;
        }
        this.logger.error(`${query} -- Parameters: ${this.stringifyParameters(parameters)} -- ${error}`);
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        if (queryRunner?.data?.isCreatingLogs) {
            return;
        }
        this.logger.warn(`Time: ${time} -- Parameters: ${this.stringifyParameters(parameters)} -- ${query}`);
    }
    logMigration(message) {
        this.logger.log(message);
    }
    logSchemaBuild(message) {
        this.logger.log(message);
    }
    log(level, message, queryRunner) {
        if (queryRunner?.data?.isCreatingLogs) {
            return;
        }
        if (level === "log") {
            return this.logger.log(message);
        }
        if (level === "info") {
            return this.logger.debug(message);
        }
        if (level === "warn") {
            return this.logger.warn(message);
        }
    }
    stringifyParameters(parameters) {
        try {
            return JSON.stringify(parameters);
        }
        catch {
            return "";
        }
    }
}
exports.QueryLogger = QueryLogger;
//# sourceMappingURL=query-logger.js.map