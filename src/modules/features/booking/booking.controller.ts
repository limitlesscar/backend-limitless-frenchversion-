import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleGuard } from "src/modules/core/auth/guards/role.guard";
import { JwtUserGuard } from "src/modules/core/auth/guards/user.guard";
import { USER_TYPE_ENUM } from "../user/enums/user-role.enum";
import { Roles } from "src/decorators/role.decorator";
import { AuthorizationHeader, CustomRequest } from "src/types/common.type";
import { BookCarDto } from "./dtos/create-booking.dto";
import { BookingEntity } from "./entities/booking.entity";
import { CancelBookingDto } from "./dtos/cancel-booking.dto";
import { AddReviewDto } from "./dtos/add-review.dto";

@Controller("booking")
@ApiTags("Booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  // ============================================= GET BOOKING BY ID FOR HOST  =============================================
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.HOST)
  @ApiOperation({ summary: "Get booking by id for host view" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("/:id")
  async GetBookingById(
    @Param("id", ParseIntPipe) id: number,
    @Req() { user }: CustomRequest,
  ): Promise<BookingEntity | {}> {
    return await this.bookingService.getCarBookingDetails(id, user.id);
  }
  // ============================================= GET BOOKING BY ID FOR USER =============================================
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.USER)
  @ApiOperation({ summary: "Get booking by id for user view" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("/user/:id")
  async GetBookingByIdea(
    @Param("id", ParseIntPipe) id: number,
    @Req() { user }: CustomRequest,
  ): Promise<BookingEntity | {}> {
    return await this.bookingService.getCarBookingDetailsForUser(id, user.id);
  }
  // ============================================= BOOK A CAR  =============================================
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.USER)
  @ApiOperation({ summary: "Book a car" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Post("")
  async validateBooking(
    @Body() bookCarDto: BookCarDto,
    @Req() { user }: CustomRequest,
  ): Promise<{ isBookingValidated: boolean; extra_details: object }> {
    return await this.bookingService.BookCar(bookCarDto, user);
  }
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.USER)
  @ApiOperation({ summary: "Add a review to booking" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Post("review")
  async AddReviewToBooking(
    @Body() addReviewDto: AddReviewDto,
    @Req() { user }: CustomRequest,
  ): Promise<{
    message: string;
    booking: BookingEntity;
  }> {
    return await this.bookingService.addReview(user, addReviewDto);
  }
  // ============================================= CANCEL A BOOKING  =============================================
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.USER)
  @ApiOperation({ summary: "Cancel a booking" })
  @UsePipes(ValidationPipe)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Patch("/cancel/:id")
  async CancelBooking(
    @Body() cancelBookingDto: CancelBookingDto,
    @Param("id", ParseIntPipe) id: number,
    @Req() { user }: CustomRequest,
  ): Promise<{
    message: string;
    booking: BookingEntity;
  }> {
    return await this.bookingService.cancelBooking(
      id,
      cancelBookingDto,
      user.id,
    );
  }
}
