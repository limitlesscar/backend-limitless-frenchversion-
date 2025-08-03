import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  RawBodyRequest,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BookingService } from "../features/booking/booking.service";
import { HostService } from "../features/host/host.service";
import { UserService } from "../features/user/user.service";
import Stripe from "stripe";
import { throwHttpException } from "src/utils/app/httpException";
import { HttpStatusCode } from "axios";
import { ONBOARDING_STATUS } from "../features/user/enums/user-onboarding-status.enum";
import { PaymentIntentMetadata } from "./interfaces/payment-intent-metadata.interface";
import { NotificationService } from "../features/notification/notification.service";
import { NOTIFICATIONS_MESSAGES } from "../features/notification/constants";
import { CreateSetupIntentDto } from "./dtos/create-setup-intent.dto";
import { ListPaymentMethodDto } from "./dtos/list-payment-methods.dto";
import RefundTemplate from "../core/mail/template/refund";
import { MailService } from "../core/mail/mail.service";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly hostService: HostService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly bookingService: BookingService,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
  ) {
    this.stripe = new Stripe(this.configService.getOrThrow("STRIPE_TEST_KEY"), {
      apiVersion: "2024-12-18.acacia",
    });
  }
  async createCustomer(email: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      email,
    });
    return customer.id;
  }
  async dashboardLoginLink(connected_account_id: string): Promise<string> {
    const link =
      await this.stripe.accounts.createLoginLink(connected_account_id);
    return link.url;
  }
  // ======================================================= CREATE STRIPE  ACCOUNT ===========================================================

  async createHostStripeAccount(host_id: number): Promise<string> {
    try {
      const host = await this.hostService.getHostFromDB({
        where: { id: host_id },
        select: { user: { id: true, email: true } },
        relations: { user: true },
      });
      if (!host) {
        throwHttpException(
          [`Host doesnot exist`],
          HttpStatusCode.NotFound,
          HttpStatus.NOT_FOUND,
        );
      }
      if (host.stripe_account_id) {
        throwHttpException(
          ["Host already has a Stripe account"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
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
    } catch (error) {
      throwHttpException(
        [error.response?.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ======================================================= GENERATE ACCOUNT LINK  ===========================================================

  async generateAccountLink(
    accountId: string,
    host_id: number,
  ): Promise<string> {
    try {
      const host = await this.hostService.getHostFromDB({
        where: { id: host_id },
        select: { user: { id: true, email: true } },
        relations: { user: true },
      });
      if (!host) {
        throwHttpException(
          [`Host doesnot exist`],
          HttpStatusCode.NotFound,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!host.stripe_account_id) {
        throwHttpException(
          [`Host stripe account doesnot exist`],
          HttpStatusCode.NotFound,
          HttpStatus.NOT_FOUND,
        );
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
    } catch (error) {
      console.log(error);
      throwHttpException(
        error.response?.message || error.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ======================================================= RETRIEVE STRIPE ACCOUNT ===========================================================
  async retrieveStripeAccount(account_id: string): Promise<Stripe.Account> {
    return await this.stripe.accounts.retrieve(account_id);
  }
  // ======================================================= CREATE SETUP INTENT ===========================================================

  async createSetupIntent({
    customer_id,
    payment_method_id,
  }: CreateSetupIntentDto): Promise<{ clientSecret: string }> {
    const setupIntent = await this.stripe.setupIntents.create({
      customer: customer_id,
      confirm: true,
      payment_method: payment_method_id,
      usage: "off_session",
      payment_method_types: ["card"],
    });

    // console.log("SETUP INTENT", setupIntent);
    if (setupIntent.client_secret) {
      return { clientSecret: setupIntent?.client_secret };
    } else {
      throwHttpException(
        [
          setupIntent.last_setup_error?.message ||
            "Something went wrong when creating setup intent",
        ],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ======================================================= GET ALL PAYMENT METHODS  ===========================================================

  async getAllPaymentMethods({
    customer_id,
    limit,
  }: ListPaymentMethodDto): Promise<
    Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>> | []
  > {
    const paymentMethods = await this.stripe.customers.listPaymentMethods(
      customer_id,
      {
        limit,
      },
    );
    if (paymentMethods.data.length === 0) {
      return [];
    }

    return paymentMethods;
  }

  // ======================================================= CREATE PAYMENT INTENT  ===========================================================

  async createPaymentIntent({
    car_id,
    car_name,
    end_date_time,
    payable_amount,
    payment_method_id,
    start_date_time,
    stripe_customer_id,
    user_id,
  }: PaymentIntentMetadata): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    try {
      const user = await this.userService.getUserFromDB({
        where: { id: user_id },
      });
      const decoded_start_date_time = decodeURIComponent(start_date_time);
      const decoded_end_date_time = decodeURIComponent(end_date_time);

      const transferGroup = `booking_${user_id}_${car_id}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const startDateTimeString = new Date(
        decoded_start_date_time,
      ).toISOString();
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
        throwHttpException(
          ["Payment intent creation failed"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }

      return paymentIntent;
    } catch (error) {
      throwHttpException(
        error.response?.message || error.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  } // ======================================================= GET PAYMENT METHOD DETAILS OF USER  ===========================================================

  async fetchPaymentMethodDetails(
    payment_method_id: string,
  ): Promise<{ lastFour: string; brand: string }> {
    const paymentMethod =
      await this.stripe.paymentMethods.retrieve(payment_method_id);

    return {
      lastFour: paymentMethod?.card?.last4,
      brand: paymentMethod?.card?.display_brand,
    };
  }

  // ======================================================= FUNCTIONS TO HANDLE WEBHOOK EVENTS FOR CONNECTED ACCOUNT  ===========================================================

  async handleAccountUpdation(
    capabilities: Stripe.Account.Capabilities.Transfers,
    accountId: string,
  ): Promise<void> {
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
            host_onboarding_status: ONBOARDING_STATUS.VERIFICATION_PENDING,
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
  // ======================================================= DETACH PAYMENT METHOD FROM USER  ===========================================================

  async detachPaymentMethod(
    payment_method_id: string,
  ): Promise<{ message: string; detached_payment_method_id: string }> {
    try {
      const detached =
        await this.stripe.paymentMethods.detach(payment_method_id);

      if (!detached) {
        throwHttpException(
          ["Payment method detachment failed"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: "Payment method detached successfully",
        detached_payment_method_id: payment_method_id,
      };
    } catch (error) {
      throwHttpException(
        error.response?.message || error.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ======================================================= HANDLE CHARGE UPDATED TO STORE STRIPE FEES  ===========================================================

  async handleChargeUpdated(stripe_charge_id: string): Promise<void> {
    const charge_expanded_object = await this.stripe.charges.retrieve(
      stripe_charge_id,
      {
        expand: ["balance_transaction"],
      },
    );

    if (
      charge_expanded_object &&
      typeof charge_expanded_object?.balance_transaction === "object"
    ) {
      const fee_in_euros = charge_expanded_object.balance_transaction.fee / 100;
      const updated_booking = await this.bookingService.updateBooking({
        where: { stripe_charge_id },
        data: { stripe_fees: fee_in_euros.toString() },
      });
    } else {
      console.log("Balance transaction is not an object:");
    }
  }
  // ======================================================= HANDLE PAYMENT INTENT COMPLETION  ===========================================================

  async successfulPaymentIntent(
    {
      car_id,
      end_date_time,
      payable_amount,
      payment_method_id,
      start_date_time,
      user_id,
    }: PaymentIntentMetadata,
    stripe_charge_id: string | null,
    transfer_group: string,
  ): Promise<void> {
    try {
      const card_details =
        await this.fetchPaymentMethodDetails(payment_method_id);
      const PaymentMethodDetails = {
        payment_method_id,
        stripe_charge_id,
        transfer_group,
        ...card_details,
      };
      await this.bookingService.BookCarWithPayment(
        {
          car_id,
          end_date_time,
          start_date_time,
        },
        user_id,
        payable_amount,
        PaymentMethodDetails,
      );
    } catch (error) {
      throwHttpException(
        error.response?.message || error.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async transferToHostConnectedAccount(
    payable_amount: number,
    stripe_connected_account_id: string,
    transfer_group: string,
    stripe_charge_id: string,
  ): Promise<Stripe.Response<Stripe.Transfer>> {
    const platform_cut = 0.15;

    const amount_to_transfer = Math.ceil(
      payable_amount - payable_amount * platform_cut,
    );

    const transfer = await this.stripe.transfers.create({
      amount: amount_to_transfer * 100,
      currency: "eur",
      destination: stripe_connected_account_id,
      // metadata: {
      //   transfer_group,
      // },
      source_transaction: stripe_charge_id,
      transfer_group,
    });
    console.log(`transfer initiated to ${stripe_connected_account_id} `);

    return transfer;
  }
  async createRefund(
    stripe_charge_id: string,
    // booking_id: number,
    // transfer_group: string
  ): Promise<Stripe.Response<Stripe.Refund>> {
    const refund = await this.stripe.refunds.create({
      charge: stripe_charge_id,
      // metadata: {
      //   booking_id,
      //   transfer_group,
      // },
      // reverse_transfer: true,
    });
    return refund;
  }
  async handleRefund(
    transfer_group: string,
    refunded: boolean,
    receipt_url: string,
    email: string,
    name: string,
  ): Promise<void> {
    const mailOptions = {
      to: email,
      subject: "Go Limitless Refund Successfull",
      html: RefundTemplate(name, receipt_url),
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

  // ======================================================= CREATING WEBHOOK  ===========================================================

  async createWebHook(
    payload: RawBodyRequest<Request>["rawBody"],
    signature: string,
  ): Promise<void> {
    try {
      if (!signature) {
        throw new BadRequestException("Signature not found");
      }
      const secret = this.configService.getOrThrow(
        "STRIPE_TEST_WEBHOOK_SECRET",
      );

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        secret,
      );
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
                message: NOTIFICATIONS_MESSAGES.PAYMENT_COMPLETED(
                  metadata.car_name,
                ).message,
                resource_id: metadata.car_id?.toString(),
                navigate_to: "Car-Details",
                user,
              },
            }),
            this.successfulPaymentIntent(
              metadata,
              event?.data?.object?.latest_charge.toString(),
              event?.data?.object?.transfer_group.toString(),
            ),
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
          await this.handleRefund(
            event?.data?.object?.transfer_group,
            event?.data?.object?.refunded,
            event?.data?.previous_attributes?.receipt_url,
            event?.data?.object?.metadata?.email,
            event.data?.object?.metadata?.name,
          );
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      throwHttpException(
        error.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ======================================================= CONNECTED ACCOUNT WEBHOOK  ===========================================================

  async createConnectWebHook(
    payload: RawBodyRequest<Request>["rawBody"],
    signature: string,
  ): Promise<void> {
    try {
      if (!signature) {
        throwHttpException(
          ["Stripe Signature not found"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }
      const secret = this.configService.getOrThrow(
        "STRIPE_CONNECT_WEBHOOK_SECRET",
      );

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        secret,
      );

      switch (event.type) {
        case "account.updated":
          await this.handleAccountUpdation(
            event.data.object.capabilities.transfers,
            event.data.object.id,
          );
          break;

        case "account.application.deauthorized":
          console.log("ACCOUNT IS DISCONNECT FROM YOUR PLATFORM");
          // console.log(event);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      throwHttpException(
        error.response?.message || error.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
