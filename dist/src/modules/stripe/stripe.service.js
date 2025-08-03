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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const booking_service_1 = require("../features/booking/booking.service");
const host_service_1 = require("../features/host/host.service");
const user_service_1 = require("../features/user/user.service");
const stripe_1 = require("stripe");
const httpException_1 = require("../../utils/app/httpException");
const axios_1 = require("axios");
const user_onboarding_status_enum_1 = require("../features/user/enums/user-onboarding-status.enum");
const notification_service_1 = require("../features/notification/notification.service");
const constants_1 = require("../features/notification/constants");
const refund_1 = require("../core/mail/template/refund");
const mail_service_1 = require("../core/mail/mail.service");
let StripeService = class StripeService {
    constructor(configService, hostService, userService, bookingService, notificationService, mailService) {
        this.configService = configService;
        this.hostService = hostService;
        this.userService = userService;
        this.bookingService = bookingService;
        this.notificationService = notificationService;
        this.mailService = mailService;
        this.stripe = new stripe_1.default(this.configService.getOrThrow("STRIPE_TEST_KEY"), {
            apiVersion: "2024-12-18.acacia",
        });
    }
    async createCustomer(email) {
        const customer = await this.stripe.customers.create({
            email,
        });
        return customer.id;
    }
    async dashboardLoginLink(connected_account_id) {
        const link = await this.stripe.accounts.createLoginLink(connected_account_id);
        return link.url;
    }
    async createHostStripeAccount(host_id) {
        try {
            const host = await this.hostService.getHostFromDB({
                where: { id: host_id },
                select: { user: { id: true, email: true } },
                relations: { user: true },
            });
            if (!host) {
                (0, httpException_1.throwHttpException)([`Host doesnot exist`], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
            }
            if (host.stripe_account_id) {
                (0, httpException_1.throwHttpException)(["Host already has a Stripe account"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const account = await this.stripe.accounts.create({
                type: "express",
                email: host.user.email,
                business_type: "individual",
                country: "FR",
                capabilities: {
                    transfers: { requested: true },
                    card_payments: { requested: true },
                },
            });
            await this.hostService.updateHost({
                where: { id: host.id },
                data: { stripe_account_id: account.id },
            });
            return account.id;
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error.response?.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async generateAccountLink(accountId, host_id) {
        try {
            const host = await this.hostService.getHostFromDB({
                where: { id: host_id },
                select: { user: { id: true, email: true } },
                relations: { user: true },
            });
            if (!host) {
                (0, httpException_1.throwHttpException)([`Host doesnot exist`], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
            }
            if (!host.stripe_account_id) {
                (0, httpException_1.throwHttpException)([`Host stripe account doesnot exist`], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
            }
            const accountLink = await this.stripe.accountLinks.create({
                account: accountId,
                refresh_url: `https://api.limitless.zenkoders.com`,
                return_url: `https://api.limitless.zenkoders.com`,
                type: "account_onboarding",
                collection_options: { fields: "eventually_due" },
            });
            await this.hostService.updateHost({
                where: { id: host_id },
                data: { stripe_link: accountLink.url },
            });
            return accountLink.url;
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error.response?.message || error.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async retrieveStripeAccount(account_id) {
        return await this.stripe.accounts.retrieve(account_id);
    }
    async createSetupIntent({ customer_id, payment_method_id, }) {
        const setupIntent = await this.stripe.setupIntents.create({
            customer: customer_id,
            confirm: true,
            payment_method: payment_method_id,
            usage: "off_session",
            payment_method_types: ["card"],
        });
        if (setupIntent.client_secret) {
            return { clientSecret: setupIntent?.client_secret };
        }
        else {
            (0, httpException_1.throwHttpException)([
                setupIntent.last_setup_error?.message ||
                    "Something went wrong when creating setup intent",
            ], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllPaymentMethods({ customer_id, limit, }) {
        const paymentMethods = await this.stripe.customers.listPaymentMethods(customer_id, {
            limit,
        });
        if (paymentMethods.data.length === 0) {
            return [];
        }
        return paymentMethods;
    }
    async createPaymentIntent({ car_id, car_name, end_date_time, payable_amount, payment_method_id, start_date_time, stripe_customer_id, user_id, }) {
        try {
            const user = await this.userService.getUserFromDB({
                where: { id: user_id },
            });
            const decoded_start_date_time = decodeURIComponent(start_date_time);
            const decoded_end_date_time = decodeURIComponent(end_date_time);
            const transferGroup = `booking_${user_id}_${car_id}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
            const startDateTimeString = new Date(decoded_start_date_time).toISOString();
            const endDateTimeString = new Date(decoded_end_date_time).toISOString();
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: payable_amount * 100,
                currency: "eur",
                customer: stripe_customer_id,
                payment_method: payment_method_id,
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    car_id,
                    car_name,
                    start_date_time: startDateTimeString,
                    end_date_time: endDateTimeString,
                    user_id,
                    payable_amount,
                    payment_method_id,
                    email: user?.email,
                    name: user?.full_name,
                },
                transfer_group: transferGroup,
                off_session: true,
                confirm: true,
            });
            if (!paymentIntent) {
                (0, httpException_1.throwHttpException)(["Payment intent creation failed"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            return paymentIntent;
        }
        catch (error) {
            (0, httpException_1.throwHttpException)(error.response?.message || error.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async fetchPaymentMethodDetails(payment_method_id) {
        const paymentMethod = await this.stripe.paymentMethods.retrieve(payment_method_id);
        return {
            lastFour: paymentMethod?.card?.last4,
            brand: paymentMethod?.card?.display_brand,
        };
    }
    async handleAccountUpdation(capabilities, accountId) {
        const user = await this.userService.getUserFromDB({
            where: { host: { stripe_account_id: accountId } },
            relations: { host: true },
        });
        if (user && capabilities === "active") {
            const dashboardLoginLink = await this.dashboardLoginLink(accountId);
            user.host.dashboard_login_link = dashboardLoginLink;
            await Promise.all([
                this.userService.updateUser({
                    where: { id: user.id },
                    data: {
                        host_onboarding_status: user_onboarding_status_enum_1.ONBOARDING_STATUS.VERIFICATION_PENDING,
                    },
                }),
                this.hostService.updateHost({
                    where: { id: user.host.id },
                    data: {
                        dashboard_login_link: dashboardLoginLink,
                    },
                }),
            ]);
            return;
        }
    }
    async detachPaymentMethod(payment_method_id) {
        try {
            const detached = await this.stripe.paymentMethods.detach(payment_method_id);
            if (!detached) {
                (0, httpException_1.throwHttpException)(["Payment method detachment failed"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                message: "Payment method detached successfully",
                detached_payment_method_id: payment_method_id,
            };
        }
        catch (error) {
            (0, httpException_1.throwHttpException)(error.response?.message || error.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async handleChargeUpdated(stripe_charge_id) {
        const charge_expanded_object = await this.stripe.charges.retrieve(stripe_charge_id, {
            expand: ["balance_transaction"],
        });
        if (charge_expanded_object &&
            typeof charge_expanded_object?.balance_transaction === "object") {
            const fee_in_euros = charge_expanded_object.balance_transaction.fee / 100;
            const updated_booking = await this.bookingService.updateBooking({
                where: { stripe_charge_id },
                data: { stripe_fees: fee_in_euros.toString() },
            });
        }
        else {
            console.log("Balance transaction is not an object:");
        }
    }
    async successfulPaymentIntent({ car_id, end_date_time, payable_amount, payment_method_id, start_date_time, user_id, }, stripe_charge_id, transfer_group) {
        try {
            const card_details = await this.fetchPaymentMethodDetails(payment_method_id);
            const PaymentMethodDetails = {
                payment_method_id,
                stripe_charge_id,
                transfer_group,
                ...card_details,
            };
            await this.bookingService.BookCarWithPayment({
                car_id,
                end_date_time,
                start_date_time,
            }, user_id, payable_amount, PaymentMethodDetails);
        }
        catch (error) {
            (0, httpException_1.throwHttpException)(error.response?.message || error.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async transferToHostConnectedAccount(payable_amount, stripe_connected_account_id, transfer_group, stripe_charge_id) {
        const platform_cut = 0.15;
        const amount_to_transfer = Math.ceil(payable_amount - payable_amount * platform_cut);
        const transfer = await this.stripe.transfers.create({
            amount: amount_to_transfer * 100,
            currency: "eur",
            destination: stripe_connected_account_id,
            source_transaction: stripe_charge_id,
            transfer_group,
        });
        console.log(`transfer initiated to ${stripe_connected_account_id} `);
        return transfer;
    }
    async createRefund(stripe_charge_id) {
        const refund = await this.stripe.refunds.create({
            charge: stripe_charge_id,
        });
        return refund;
    }
    async handleRefund(transfer_group, refunded, receipt_url, email, name) {
        const mailOptions = {
            to: email,
            subject: "Go Limitless Refund Successfull",
            html: (0, refund_1.default)(name, receipt_url),
        };
        if (refunded) {
            await Promise.all([
                this.bookingService.updateBooking({
                    where: { transfer_group: transfer_group },
                    data: { is_refunded: true },
                }),
                this.mailService.sendMail({ mailOptions: mailOptions }),
            ]);
        }
    }
    async createWebHook(payload, signature) {
        try {
            if (!signature) {
                throw new common_1.BadRequestException("Signature not found");
            }
            const secret = this.configService.getOrThrow("STRIPE_TEST_WEBHOOK_SECRET");
            const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
            switch (event.type) {
                case "payment_intent.succeeded":
                    const metadata = {
                        car_id: Number(event?.data?.object?.metadata?.car_id),
                        car_name: event?.data?.object?.metadata?.car_name,
                        end_date_time: event?.data?.object?.metadata?.end_date_time,
                        payable_amount: event?.data?.object?.amount,
                        payment_method_id: event?.data?.object?.payment_method.toString(),
                        start_date_time: event?.data?.object?.metadata?.start_date_time,
                        user_id: Number(event?.data?.object?.metadata?.user_id),
                    };
                    const user = await this.userService.getUserFromDB({
                        where: { id: metadata.user_id },
                        select: { fcm_token: { id: true, token: true } },
                        relations: { fcm_token: true },
                    });
                    await Promise.all([
                        this.notificationService.sendNotification({
                            fcmTokens: user.fcm_token.map((token) => token.token),
                            data: {
                                message: constants_1.NOTIFICATIONS_MESSAGES.PAYMENT_COMPLETED(metadata.car_name).message,
                                resource_id: metadata.car_id?.toString(),
                                navigate_to: "Car-Details",
                                user,
                            },
                        }),
                        this.successfulPaymentIntent(metadata, event?.data?.object?.latest_charge.toString(), event?.data?.object?.transfer_group.toString()),
                    ]);
                    break;
                case "charge.updated":
                    await this.handleChargeUpdated(event?.data?.object?.id);
                    break;
                case "payment_intent.payment_failed":
                    console.log("payment intent failed");
                    break;
                case "transfer.created":
                    console.log("transfer created");
                    break;
                case "transfer.updated":
                    console.log("transfer updated");
                    break;
                case "refund.created":
                    console.log("refund created");
                    break;
                case "charge.refunded":
                    console.log("charge refunded");
                    await this.handleRefund(event?.data?.object?.transfer_group, event?.data?.object?.refunded, event?.data?.previous_attributes?.receipt_url, event?.data?.object?.metadata?.email, event.data?.object?.metadata?.name);
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createConnectWebHook(payload, signature) {
        try {
            if (!signature) {
                (0, httpException_1.throwHttpException)(["Stripe Signature not found"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const secret = this.configService.getOrThrow("STRIPE_CONNECT_WEBHOOK_SECRET");
            const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
            switch (event.type) {
                case "account.updated":
                    await this.handleAccountUpdation(event.data.object.capabilities.transfers, event.data.object.id);
                    break;
                case "account.application.deauthorized":
                    console.log("ACCOUNT IS DISCONNECT FROM YOUR PLATFORM");
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error.response?.message || error.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, host_service_1.HostService,
        user_service_1.UserService,
        booking_service_1.BookingService,
        notification_service_1.NotificationService,
        mail_service_1.MailService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map