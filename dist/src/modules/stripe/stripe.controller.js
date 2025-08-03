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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const role_decorator_1 = require("../../decorators/role.decorator");
const common_type_1 = require("../../types/common.type");
const role_guard_1 = require("../core/auth/guards/role.guard");
const stripe_service_1 = require("./stripe.service");
const user_role_enum_1 = require("../features/user/enums/user-role.enum");
const user_guard_1 = require("../core/auth/guards/user.guard");
const create_payment_intent_dto_1 = require("./dtos/create-payment-intent.dto");
const create_setup_intent_dto_1 = require("./dtos/create-setup-intent.dto");
const httpException_1 = require("../../utils/app/httpException");
const axios_1 = require("axios");
const list_payment_methods_dto_1 = require("./dtos/list-payment-methods.dto");
let StripeController = class StripeController {
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    async getPaymentMethods(listPaymentMethodDto) {
        return await this.stripeService.getAllPaymentMethods(listPaymentMethodDto);
    }
    async retrieveStripeAccount(id) {
        return await this.stripeService.retrieveStripeAccount(id);
    }
    async createHostStripeAccount(id) {
        try {
            const account_id = await this.stripeService.createHostStripeAccount(id);
            return {
                message: "Account created successfully",
                account_id,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`${error.message}`);
        }
    }
    async webhook(sig, req) {
        try {
            return await this.stripeService.createWebHook(req.rawBody, sig);
        }
        catch (err) {
            console.log(err);
            (0, httpException_1.throwHttpException)(err?.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async webhookConnect(sig, req) {
        try {
            return await this.stripeService.createConnectWebHook(req.rawBody, sig);
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error?.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createAccountLink(accountId, { user }) {
        try {
            const onboardingLink = await this.stripeService.generateAccountLink(accountId, user?.host?.id);
            return { onboardingLink };
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createSetupIntent(setupIntentDto) {
        return await this.stripeService.createSetupIntent(setupIntentDto);
    }
    async createPaymentIntent(createPaymentIntentDto, { user }) {
        const res = await this.stripeService.createPaymentIntent({
            ...createPaymentIntentDto,
            stripe_customer_id: user?.stripe_customer_id,
        });
        return {
            clientSecret: res?.client_secret,
        };
    }
    async detachPaymentMethod(id) {
        return await this.stripeService.detachPaymentMethod(id);
    }
};
exports.StripeController = StripeController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all payment methods of a customer" }),
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Get)("payment-methods"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_payment_methods_dto_1.ListPaymentMethodDto]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "getPaymentMethods", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Retrieve a stripe account" }),
    (0, common_1.Get)("account/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "retrieveStripeAccount", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a host connect account" }),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.HOST),
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, swagger_1.ApiParam)({ name: "id", example: "1", description: "Id of the host" }),
    (0, common_1.Post)("account/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createHostStripeAccount", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Webhook for stripe" }),
    (0, swagger_1.ApiHeaders)([
        {
            name: "Stripe-Signature",
            description: "Stripe Signature",
            required: true,
        },
    ]),
    (0, common_1.Post)("/webhook"),
    __param(0, (0, common_1.Headers)("stripe-signature")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "webhook", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Webhook for stripe connect" }),
    (0, swagger_1.ApiHeaders)([
        {
            name: "Stripe-Signature",
            description: "Stripe Signature",
            required: true,
        },
    ]),
    (0, common_1.Post)("/webhook/connect"),
    __param(0, (0, common_1.Headers)("stripe-signature")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "webhookConnect", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a stripe account link" }),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.HOST),
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, swagger_1.ApiParam)({ name: "id", example: "1", description: "Id of the host" }),
    (0, common_1.Post)("account-link"),
    __param(0, (0, common_1.Query)("accountId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createAccountLink", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Create a stripe setup intent for adding a payment method",
    }),
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.USER),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Post)("/setup-intent"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_setup_intent_dto_1.CreateSetupIntentDto]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createSetupIntent", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Create a stripe payment intent for a car booking",
    }),
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_role_enum_1.USER_TYPE_ENUM.USER),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Post)("/payment-intent"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_intent_dto_1.CreatePaymentIntentDto, Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createPaymentIntent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Detach a payment method" }),
    (0, common_1.UseGuards)(user_guard_1.JwtUserGuard),
    (0, swagger_1.ApiBearerAuth)(common_type_1.AuthorizationHeader.BEARER),
    (0, common_1.Delete)("/payment-method/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "detachPaymentMethod", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)("stripe"),
    (0, swagger_1.ApiTags)("Stripe"),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map