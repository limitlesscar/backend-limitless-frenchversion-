import { RawBodyRequest } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BookingService } from "../features/booking/booking.service";
import { HostService } from "../features/host/host.service";
import { UserService } from "../features/user/user.service";
import Stripe from "stripe";
import { PaymentIntentMetadata } from "./interfaces/payment-intent-metadata.interface";
import { NotificationService } from "../features/notification/notification.service";
import { CreateSetupIntentDto } from "./dtos/create-setup-intent.dto";
import { ListPaymentMethodDto } from "./dtos/list-payment-methods.dto";
import { MailService } from "../core/mail/mail.service";
export declare class StripeService {
    private readonly configService;
    private readonly hostService;
    private readonly userService;
    private readonly bookingService;
    private readonly notificationService;
    private readonly mailService;
    private stripe;
    constructor(configService: ConfigService, hostService: HostService, userService: UserService, bookingService: BookingService, notificationService: NotificationService, mailService: MailService);
    createCustomer(email: string): Promise<string>;
    dashboardLoginLink(connected_account_id: string): Promise<string>;
    createHostStripeAccount(host_id: number): Promise<string>;
    generateAccountLink(accountId: string, host_id: number): Promise<string>;
    retrieveStripeAccount(account_id: string): Promise<Stripe.Account>;
    createSetupIntent({ customer_id, payment_method_id, }: CreateSetupIntentDto): Promise<{
        clientSecret: string;
    }>;
    getAllPaymentMethods({ customer_id, limit, }: ListPaymentMethodDto): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>> | []>;
    createPaymentIntent({ car_id, car_name, end_date_time, payable_amount, payment_method_id, start_date_time, stripe_customer_id, user_id, }: PaymentIntentMetadata): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    fetchPaymentMethodDetails(payment_method_id: string): Promise<{
        lastFour: string;
        brand: string;
    }>;
    handleAccountUpdation(capabilities: Stripe.Account.Capabilities.Transfers, accountId: string): Promise<void>;
    detachPaymentMethod(payment_method_id: string): Promise<{
        message: string;
        detached_payment_method_id: string;
    }>;
    handleChargeUpdated(stripe_charge_id: string): Promise<void>;
    successfulPaymentIntent({ car_id, end_date_time, payable_amount, payment_method_id, start_date_time, user_id, }: PaymentIntentMetadata, stripe_charge_id: string | null, transfer_group: string): Promise<void>;
    transferToHostConnectedAccount(payable_amount: number, stripe_connected_account_id: string, transfer_group: string, stripe_charge_id: string): Promise<Stripe.Response<Stripe.Transfer>>;
    createRefund(stripe_charge_id: string): Promise<Stripe.Response<Stripe.Refund>>;
    handleRefund(transfer_group: string, refunded: boolean, receipt_url: string, email: string, name: string): Promise<void>;
    createWebHook(payload: RawBodyRequest<Request>["rawBody"], signature: string): Promise<void>;
    createConnectWebHook(payload: RawBodyRequest<Request>["rawBody"], signature: string): Promise<void>;
}
