import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Query,
  RawBodyRequest,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiTags,
  ApiHeaders,
} from "@nestjs/swagger";
import { Roles } from "src/decorators/role.decorator";
import { AuthorizationHeader, CustomRequest } from "src/types/common.type";
import { RoleGuard } from "../core/auth/guards/role.guard";
import { StripeService } from "./stripe.service";
import { USER_TYPE_ENUM } from "../features/user/enums/user-role.enum";
import { JwtUserGuard } from "../core/auth/guards/user.guard";
import Stripe from "stripe";
import { CreatePaymentIntentDto } from "./dtos/create-payment-intent.dto";
import { CreateSetupIntentDto } from "./dtos/create-setup-intent.dto";
import { throwHttpException } from "src/utils/app/httpException";
import { HttpStatusCode } from "axios";
import { ListPaymentMethodDto } from "./dtos/list-payment-methods.dto";

@Controller("stripe")
@ApiTags("Stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiOperation({ summary: "Get all payment methods of a customer" })
  @UseGuards(JwtUserGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("payment-methods")
  async getPaymentMethods(
    @Query() listPaymentMethodDto: ListPaymentMethodDto,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>> | []> {
    return await this.stripeService.getAllPaymentMethods(listPaymentMethodDto);
  }
  @ApiOperation({ summary: "Retrieve a stripe account" })
  @Get("account/:id")
  async retrieveStripeAccount(
    @Param("id") id: string,
  ): Promise<Stripe.Account> {
    return await this.stripeService.retrieveStripeAccount(id);
  }

  @ApiOperation({ summary: "Create a host connect account" })
  @Roles(USER_TYPE_ENUM.HOST)
  @UseGuards(JwtUserGuard, RoleGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @ApiParam({ name: "id", example: "1", description: "Id of the host" })
  @Post("account/:id")
  async createHostStripeAccount(
    @Param("id") id: number,
  ): Promise<{ message: string; account_id: string }> {
    try {
      const account_id = await this.stripeService.createHostStripeAccount(id);
      return {
        message: "Account created successfully",
        account_id,
      };
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  @ApiOperation({ summary: "Webhook for stripe" })
  @ApiHeaders([
    {
      name: "Stripe-Signature",
      description: "Stripe Signature",
      required: true,
    },
  ])
  @Post("/webhook")
  async webhook(
    @Headers("stripe-signature") sig: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<void> {
    try {
      return await this.stripeService.createWebHook(req.rawBody, sig);
    } catch (err) {
      console.log(err);
      throwHttpException(
        err?.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @ApiOperation({ summary: "Webhook for stripe connect" })
  @ApiHeaders([
    {
      name: "Stripe-Signature",
      description: "Stripe Signature",
      required: true,
    },
  ])
  @Post("/webhook/connect")
  async webhookConnect(
    @Headers("stripe-signature") sig: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<void> {
    try {
      return await this.stripeService.createConnectWebHook(req.rawBody, sig);
    } catch (error) {
      console.log(error);
      throwHttpException(
        error?.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: "Create a stripe account link" })
  @Roles(USER_TYPE_ENUM.HOST)
  @UseGuards(JwtUserGuard, RoleGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @ApiParam({ name: "id", example: "1", description: "Id of the host" })
  @Post("account-link")
  async createAccountLink(
    @Query("accountId") accountId: string,
    @Req() { user }: CustomRequest,
  ): Promise<{ onboardingLink: string }> {
    try {
      const onboardingLink = await this.stripeService.generateAccountLink(
        accountId,
        user?.host?.id,
      );

      return { onboardingLink };
    } catch (error) {
      throwHttpException(
        [error.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: "Create a stripe setup intent for adding a payment method",
  })
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.USER)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Post("/setup-intent")
  async createSetupIntent(
    @Body()
    setupIntentDto: CreateSetupIntentDto,
  ): Promise<{ clientSecret: string }> {
    return await this.stripeService.createSetupIntent(setupIntentDto);
  }
  @ApiOperation({
    summary: "Create a stripe payment intent for a car booking",
  })
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.USER)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Post("/payment-intent")
  async createPaymentIntent(
    @Body()
    createPaymentIntentDto: CreatePaymentIntentDto,
    @Req() { user }: CustomRequest,
  ): Promise<{ clientSecret: string }> {
    const res = await this.stripeService.createPaymentIntent({
      ...createPaymentIntentDto,
      stripe_customer_id: user?.stripe_customer_id,
    });
    return {
      clientSecret: res?.client_secret,
    };
  }

  // @ApiOperation({ summary: "transfer to connected account" })
  // @Post("/transfer")
  // async TransferToConnectedAccount(
  //   @Body()
  //   {
  //     payable_amount,
  //     stripe_charge_id,
  //     stripe_connected_account_id,
  //   }: TransferDto
  // ): Promise<any> {
  //   return await this.stripeService.transferToHostConnectedAccount(
  //     payable_amount,
  //     stripe_charge_id,
  //     stripe_connected_account_id,
  //     stripe_charge_id
  //   );
  // }
  // @ApiOperation({ summary: "transfer to connected account (TESTING PURPOSE)" })
  // @Post("/transfer")
  // async TransferToConnectedAccount(
  //   @Body()
  //   {
  //     payable_amount,
  //     stripe_charge_id,
  //     stripe_connected_account_id,
  //   }: TransferDto
  // ): Promise<any> {
  //   return await this.stripeService.transferToHostConnectedAccount(
  //     payable_amount,
  //     stripe_charge_id,
  //     stripe_connected_account_id,
  //     stripe_charge_id
  //   );
  // }
  @ApiOperation({ summary: "Detach a payment method" })
  @UseGuards(JwtUserGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Delete("/payment-method/:id")
  async detachPaymentMethod(@Param("id") id: string): Promise<{
    message: string;
    detached_payment_method_id: string;
  }> {
    return await this.stripeService.detachPaymentMethod(id);
  }
}
