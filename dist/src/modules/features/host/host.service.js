"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostService = void 0;
const common_1 = require("@nestjs/common");
const host_repository_1 = require("./repositories/host.repository");
const httpException_1 = require("../../../utils/app/httpException");
const axios_1 = require("axios");
const booking_status_enum_1 = require("../booking/enums/booking-status.enum");
let HostService = class HostService {
    constructor(hostRepository) {
        this.hostRepository = hostRepository;
    }
    async createHost(host) {
        const created = this.hostRepository.create(host);
        return await this.hostRepository.save(created);
    }
    getHostFromDB({ where, select, relations, }) {
        return this.hostRepository.findOne({
            where,
            select,
            relations,
        });
    }
    async updateHost({ data, where, relations, select, }) {
        await this.hostRepository.update(where, data);
        return this.getHostFromDB({ where, relations, select });
    }
    async getHostWithStars(hostId) {
        try {
            const host = this.hostRepository
                .createQueryBuilder("host")
                .leftJoin("host.bookings", "hostBookings", "hostBookings.status = :status", {
                status: booking_status_enum_1.BookingStatus.COMPLETED,
            })
                .innerJoin("host.user", "user")
                .where("host.id = :hostId", { hostId: hostId })
                .select([
                `json_build_object('id',host.id,'host_user_id',"user"."id",'full_name',"user"."full_name",'profile_picture',"user"."profile_picture",'phone_number',"user"."phone_number",'stars',COALESCE(ROUND(SUM(hostBookings.stars) * 1.0 / NULLIF(COUNT(DISTINCT hostBookings.id), 0), 2), 0))as host`,
            ])
                .groupBy(`host.id,"user"."id"`);
            return await host.getRawOne();
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(["Unable to fetch host with stars"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.HostService = HostService;
exports.HostService = HostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [host_repository_1.HostRepository])
], HostService);
//# sourceMappingURL=host.service.js.map