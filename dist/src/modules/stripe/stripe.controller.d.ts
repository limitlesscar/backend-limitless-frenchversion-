import { RawBodyRequest } from "@nestjs/common";
import { CustomRequest } from "src/types/common.type";
import { StripeService } from "./stripe.service";
import Stripe from "stripe";
import { CreatePaymentIntentDto } from "./dtos/create-payment-intent.dto";
import { CreateSetupIntentDto } from "./dtos/create-setup-intent.dto";
import { ListPaymentMethodDto } from "./dtos/list-payment-methods.dto";
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    getPaymentMethods(listPaymentMethodDto: ListPaymentMethodDto): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>> | []>;
    retrieveStripeAccount(id: string): Promise<Stripe.Account>;
    createHostStripeAccount(id: number): Promise<{
        message: string;
        account_id: string;
    }>;
    webhook(sig: string, req: RawBodyRequest<Request>): Promise<void>;
    webhookConnect(sig: string, req: RawBodyRequest<Request>): Promise<void>;
    createAccountLink(accountId: string, { user }: CustomRequest): Promise<{
        onboardingLink: string;
    }>;
    createSetupIntent(setupIntentDto: CreateSetupIntentDto): Promise<{
        clientSecret: string;
    }>;
    createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto, { user }: CustomRequest): Promise<{
        clientSecret: string;
    }>;
    detachPaymentMethod(id: string): Promise<{
        message: string;
        detached_payment_method_id: string;
    }>;
}
