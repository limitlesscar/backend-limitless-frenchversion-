// Nest JS
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

// Utils
import { errorSchema } from "src/utils/app/error-schema";

// Entities
import { UserEntity } from "./entities/user.entity";

// Services
import { UserService } from "./user.service";

// Types
import { AuthorizationHeader, CustomRequest } from "src/types/common.type";
import { JwtUserGuard } from "src/modules/core/auth/guards/user.guard";
import { PersonalDetailsDto } from "./dto/personal-details.dto";
import { DrivingDetailsDto } from "./dto/driving-details.dto";
import { LocationDto } from "./dto/set-location.dto";
import { LogoutDto } from "./dto/logout.dto";
import { UserEditProfileDTO } from "./dto/edit-profile.dto";
import { EditDrivingDetailsDto } from "./dto/edit-driving-details.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { throwHttpException } from "src/utils/app/httpException";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { HttpStatusCode } from "axios";
import { RegisterDTO } from "src/modules/core/auth/dto/register.dto";
import { UserLogin } from "src/modules/core/auth/response";
import { OrdersDto } from "./dto/my-orders.dto";
import { BookingEntity } from "../booking/entities/booking.entity";
import { AddFcmTokenDto } from "./dto/add-fcm-token.dto";
import { SetNotificationPreference } from "./dto/notification-preference";

@Controller("user")
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ============================================= GET USER BY JWT TOKEN =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Get user by jwt token" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("me")
  async whoAmI(@Req() { user }: CustomRequest): Promise<UserEntity> {
    return user;
  }
  // ============================================= GET MY ORDERS =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Get my orders" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("orders")
  async myOrders(
    @Req() { user }: CustomRequest,
    @Query() ordersDto: OrdersDto,
  ): Promise<{
    orders: BookingEntity[];
    hasMore: boolean;
  }> {
    return await this.userService.myOrders(user, ordersDto);
  }
  // ============================================= GET ORDERS FOR MY CAR =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Get orders for my cars" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("orders/mycars")
  async OrdersForMyCars(
    @Req() { user }: CustomRequest,
    @Query() ordersDto: OrdersDto,
  ): Promise<{
    orders: BookingEntity[];
    hasMore: boolean;
  }> {
    return await this.userService.ordersForMyCars(user, ordersDto);
  }

  // ============================================= GET USER BY ID =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Get user by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User Retrieved Successfully",
    type: UserEntity,
  })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("/:id")
  async getUserById(@Param("id") id: number): Promise<Partial<UserEntity>> {
    const user = await this.userService.getUserFromDB({
      where: { id },
      relations: { host: true },
    });
    if (!user) {
      throwHttpException(
        [ErrorMessages.USER_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    delete user.password;
    return user;
  }
  // ========================================== Register aka onboarding ==========================================
  @ApiOperation({ summary: "Register a user aka onboarding" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User has been successfully registered.",
    type: UserLogin,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation failed.",
    schema: errorSchema(HttpStatus.BAD_REQUEST),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found.",
    schema: errorSchema(HttpStatus.NOT_FOUND),
  })
  @ApiBody({ type: RegisterDTO })
  @Post("")
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() registerDto: RegisterDTO,
  ): Promise<{ user: UserEntity; token: string }> {
    return await this.userService.register(registerDto);
  }
  // ============================================= ADD FCM TOKEN =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Add fcm token" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Post("/fcm-token")
  @UsePipes(ValidationPipe)
  async addFcmToken(
    @Body() { fcmToken }: AddFcmTokenDto,
    @Req() { user }: CustomRequest,
  ): Promise<{ message: string }> {
    return await this.userService.addFcmToken(fcmToken, user.id);
  }
  // ============================================= SET USER PERSONAL DETAILS =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Set user personal details" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UsePipes(ValidationPipe)
  @Post("personal-details")
  async setPersonalDetails(
    @Req() { user }: CustomRequest,
    @Body() personalDetailsDto: PersonalDetailsDto,
  ): Promise<{ message: string; data: Partial<UserEntity> }> {
    return await this.userService.setPersonalDetails(user, personalDetailsDto);
  }
  // ============================================= SET DRIVING DETAILS =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Set user driving details" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UsePipes(ValidationPipe)
  @Post("driving-details")
  async setDrivingDetails(
    @Req() { user }: CustomRequest,
    @Body() drivingDetailsDto: DrivingDetailsDto,
  ): Promise<{
    message: string;
    user: Partial<UserEntity>;
    isVerificationPending: boolean;
  }> {
    return await this.userService.setDrivingDetails(drivingDetailsDto, user);
  }

  // ============================================= LOGOUT A USER =============================================
  @ApiOperation({ summary: "Logout a user" })
  @UsePipes(ValidationPipe)
  @Post("logout")
  async Logout(@Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    return await this.userService.logout(logoutDto);
  }

  // ============================================== SET USER NOTTIFICATION PREFERENCE ==============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Set notification preference" })
  @Post("/preference")
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  async setNotificationPreference(
    @Body() setNotificationPreference: SetNotificationPreference,
    @Req() { user }: CustomRequest,
  ): Promise<{ message: string; user: UserEntity }> {
    return await this.userService.updateUserNotificationPreference(
      user,
      setNotificationPreference,
    );
  }

  // ============================================= UPDATE USER PROFILE  =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Update user profile" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UsePipes(ValidationPipe)
  @Patch("personal-details")
  async updateUserProfile(
    @Req() { user }: CustomRequest,
    @Body() userEditProfileDTO: UserEditProfileDTO,
  ): Promise<{ message: string; user: Partial<UserEntity> }> {
    return await this.userService.editUserProfile(user, userEditProfileDTO);
  }

  // ============================================= UPDATE USER DRIVING DETAILS =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Update user driving details" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UsePipes(ValidationPipe)
  @Patch("driving-details")
  async updateDrivingDetails(
    @Req() { user }: CustomRequest,
    @Body() editDrivingDetailsDto: EditDrivingDetailsDto,
  ): Promise<{ message: string; user: Partial<UserEntity> }> {
    return await this.userService.editDrivingDetails(
      user,
      editDrivingDetailsDto,
    );
  }

  // ============================================= SET USER LOCATION =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Set user location" })
  @UsePipes(ValidationPipe)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Patch("location")
  async setUserLocation(
    @Req() { user }: CustomRequest,
    @Body() locationDto: LocationDto,
  ): Promise<{
    message: string;
    user: Partial<UserEntity>;
  }> {
    return await this.userService.setLocation(user, locationDto);
  }

  // ============================================= CHANGE USER PASSWORD =============================================
  @UseGuards(JwtUserGuard)
  @ApiOperation({ summary: "Change user password" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UsePipes(ValidationPipe)
  @Patch("change-password")
  async changePassword(
    @Req() { user }: CustomRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{
    message: string;
  }> {
    return await this.userService.changePassword(user, changePasswordDto);
  }
}
