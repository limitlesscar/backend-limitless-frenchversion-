"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostModule = void 0;
const common_1 = require("@nestjs/common");
const host_service_1 = require("./host.service");
const host_controller_1 = require("./host.controller");
const host_repository_1 = require("./repositories/host.repository");
const typeorm_1 = require("@nestjs/typeorm");
const host_entity_1 = require("./entities/host.entity");
let HostModule = class HostModule {
};
exports.HostModule = HostModule;
exports.HostModule = HostModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([host_entity_1.HostEntity])],
        controllers: [host_controller_1.HostController],
        providers: [host_service_1.HostService, host_repository_1.HostRepository],
        exports: [host_service_1.HostService, host_repository_1.HostRepository],
    })
], HostModule);
//# sourceMappingURL=host.module.js.map