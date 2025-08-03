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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("./repositories/admin.repository");
const jwt_admin_service_1 = require("../../core/jwt/services/jwt-admin.service");
const httpException_1 = require("../../../utils/app/httpException");
const axios_1 = require("axios");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
const user_repository_1 = require("../user/repositories/user.repository");
const typeorm_1 = require("typeorm");
const mail_service_1 = require("../../core/mail/mail.service");
const user_rejection_1 = require("../../core/mail/template/user-rejection");
const user_approval_1 = require("../../core/mail/template/user-approval");
const notification_service_1 = require("../notification/notification.service");
let AdminService = class AdminService {
    constructor(adminRepository, jwtAdminService, userRepository, mailService, notificationService) {
        this.adminRepository = adminRepository;
        this.jwtAdminService = jwtAdminService;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.notificationService = notificationService;
    }
    async createAdmin(data) {
        return await this.adminRepository.insert(data);
    }
    async login({ email, password }) {
        email = email.toLowerCase();
        const admin = await this.adminRepository.findOne({
            where: { email },
        });
        if (!admin) {
            (0, httpException_1.throwHttpException)(["Admin not found"], axios_1.HttpStatusCode.Unauthorized, common_1.HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = password === admin.password;
        if (!isPasswordValid) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_CREDENTIALS], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const token = this.jwtAdminService.generateAuthToken({
            payload: { id: admin.id, email: admin.email },
        });
        return {
            message: "Login successful",
            token,
        };
    }
    async UsersFromDb({ role, page, limit, search, status }) {
        const skip = (page - 1) * limit;
        const take = limit ? limit : 10;
        const query = this.userRepository.createQueryBuilder("user");
        query
            .leftJoinAndSelect("user.host", "host")
            .select([
            "user.id",
            "user.full_name",
            "user.email",
            "user.phone_number",
            "user.profile_picture",
            "user.is_rejected",
            "user.user_type",
            "user.is_verified",
        ])
            .skip(skip)
            .take(take);
        if (role) {
            query.andWhere("user.user_type @> :type", { type: [role] });
        }
        if (status) {
            switch (status) {
                case "Approved":
                    query.andWhere("user.is_verified = :is_verified", {
                        is_verified: true,
                    });
                    break;
                case "Pending":
                    query.andWhere("user.is_verified = :is_verified and user.is_rejected =false", { is_verified: false });
                    break;
                case "Rejected":
                    query.andWhere("user.is_rejected = :is_rejected", {
                        is_rejected: true,
                    });
                    break;
                default:
                    break;
            }
        }
        if (search) {
            query.andWhere(new typeorm_1.Brackets((qb) => {
                qb.where("user.full_name ILIKE :search", {
                    search: `%${search}%`,
                })
                    .orWhere("user.email ILIKE :search", {
                    search: `%${search}%`,
                })
                    .orWhere("user.phone_number ILIKE :search", {
                    search: `%${search}%`,
                });
            }));
        }
        const [data, total] = await query.getManyAndCount();
        const totalPages = Math.ceil(total / take);
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;
        return {
            data,
            total,
            totalPages,
            currentPage: page,
            nextPage,
            previousPage,
        };
    }
    async rejectUser({ id, rejection_reason, }) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: {
                fcm_token: { id: true, token: true },
            },
            relations: { fcm_token: true },
        });
        if (!user) {
            (0, httpException_1.throwHttpException)(["User not found"], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        if (user.is_rejected) {
            (0, httpException_1.throwHttpException)(["User is already rejected"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.is_verified) {
            (0, httpException_1.throwHttpException)(["User is already verified"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const [rejection] = await Promise.all([
            this.userRepository.update(id, {
                is_rejected: true,
                rejection_reason,
            }),
            this.mailService.sendMail({
                mailOptions: {
                    subject: "User Profile Rejected",
                    to: user.email,
                    html: (0, user_rejection_1.rejectionEmailTemplate)(rejection_reason),
                },
            }),
            this.notificationService.sendAdminNotification({
                fcmTokens: user.fcm_token?.map((user) => user.token),
                message: "Your profile has been rejected, please check your email for more details",
            }),
        ]);
        if (!rejection.affected) {
            (0, httpException_1.throwHttpException)(["User rejection failed"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            message: "User rejected successfully",
            rejectedUser: user,
        };
    }
    async approveUser(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: {
                fcm_token: { id: true, token: true },
            },
            relations: { fcm_token: true },
        });
        if (!user) {
            (0, httpException_1.throwHttpException)(["User not found"], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
        }
        if (user.is_verified) {
            (0, httpException_1.throwHttpException)(["User is already verified"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.is_rejected) {
            (0, httpException_1.throwHttpException)(["User is rejected"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const [approval] = await Promise.all([
            this.userRepository.update(id, {
                is_verified: true,
            }),
            this.mailService.sendMail({
                mailOptions: {
                    subject: "User Profile Approved",
                    to: user.email,
                    html: (0, user_approval_1.successfulReviewEmailTemplate)(),
                },
            }),
            this.notificationService.sendAdminNotification({
                fcmTokens: user.fcm_token?.map((user) => user.token),
                message: "Your profile has been approved, please check your email for confirmation",
            }),
        ]);
        if (!approval.affected) {
            (0, httpException_1.throwHttpException)(["User approval failed"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            message: "User approved successfully",
            approvedUser: user,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_repository_1.AdminRepository,
        jwt_admin_service_1.JwtAdminService,
        user_repository_1.UserRepository,
        mail_service_1.MailService,
        notification_service_1.NotificationService])
], AdminService);
//# sourceMappingURL=admin.service.js.map