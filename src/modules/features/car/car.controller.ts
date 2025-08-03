import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CarService } from "./car.service";
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { RegisterCarDto } from "./dto/register-car.dto";
import { JwtUserGuard } from "src/modules/core/auth/guards/user.guard";
import { RoleGuard } from "src/modules/core/auth/guards/role.guard";
import { Roles } from "src/decorators/role.decorator";
import { USER_TYPE_ENUM } from "../user/enums/user-role.enum";
import { AuthorizationHeader, CustomRequest } from "src/types/common.type";
import { EditCarDto } from "./dto/edit-car.dto";
import { PaginationDto } from "src/types/pagination/common.dto";
import { FilterCarDto } from "./dto/filter-car.dto";
import { BookingService } from "../booking/booking.service";
import { ChatTypeDto } from "./dto/logged-in-userid.dto";
import { CarStatus } from "./enums/car-status.enum";

@Controller("car")
@ApiTags("Car")
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly bookingService: BookingService,
  ) {}

  // ============================================= LIST MY CARS  =============================================
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.HOST)
  @ApiOperation({ summary: "Get Logged In Host Cars" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("/host")
  async getMyCars(
    @Req() { user: { host } }: CustomRequest,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.carService.listMyCars(host, paginationDto);
  }
  // =============================================  FILTERED CARS  =============================================

  @ApiOperation({ summary: "Filter cars" })
  @ApiHeaders([{ name: "authorization", required: false }])
  @Get("/filter")
  async filterCars(
    @Query() filterCarDto: FilterCarDto,
    @Headers("authorization") authHeader: string,
  ) {
    const token = authHeader?.split(" ")[1];
    return await this.carService.filterCars(filterCarDto, token);
  }
  // ============================================= LIST ALL BOOKING DATES OF A CAR  =============================================

  @ApiOperation({ summary: "List all booking dates of a car" })
  @ApiHeaders([{ name: "authorization", required: false }])
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("/:id/bookings")
  async listAllCarBookings(@Param("id", ParseIntPipe) id: number) {
    return await this.bookingService.getAllValidBookingsOfCar(id);
  }
  // ============================================= LIST CARS WITH COORDINATES FOR MAP =============================================
  @ApiOperation({ summary: "List all cars with coordinates for map" })
  @Get("/map")
  async getCarsForMap(@Headers("authorization") authHeader: string) {
    const token = authHeader?.split(" ")[1];

    return await this.carService.getCarsCordinates(token);
  }

  // ============================================= GET CAR BY ID  =============================================
  @ApiOperation({ summary: "Get Car By Id" })
  @ApiHeaders([{ name: "authorization", required: false }])
  @Get("/:id")
  async getCarById(
    @Param("id", ParseIntPipe) id: number,
    @Query() { chat_type }: ChatTypeDto,
    @Headers("authorization") authHeader: string,
  ) {
    const token = authHeader?.split(" ")[1];
    return await this.carService.getCarDetails(id, chat_type, token);
  }
  // ============================================= GET CAR BY ID FOR MAP  =============================================
  @ApiOperation({ summary: "Get Car By Id For Map" })
  @Get("/map/:id")
  async getCarByIdforMap(@Param("id", ParseIntPipe) id: number) {
    return await this.carService.getCarByIdForMap(id);
  }
  // ============================================= REGISTER CAR  =============================================
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.HOST)
  @ApiOperation({ summary: "Register Car" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Post("")
  Register(
    @Body() registerCarDto: RegisterCarDto,
    @Req() { user }: CustomRequest,
  ) {
    return this.carService.register(registerCarDto, user);
  }

  // ============================================= EDIT CAR DETAILS  =============================================
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.HOST)
  @ApiOperation({ summary: "Edit Car Details" })
  @ApiParam({ name: "id", description: "Car Id", type: "number" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Patch("/:id")
  updateCarDetails(
    @Body() editCarDto: EditCarDto,
    @Param("id", ParseIntPipe) id: number,
    @Req() { user: { host } }: CustomRequest,
  ) {
    return this.carService.EditCarDetails(id, editCarDto, host);
  }
  // ============================================= UNPUBLISH CAR  =============================================
  @UseGuards(JwtUserGuard, RoleGuard)
  @Roles(USER_TYPE_ENUM.HOST)
  @ApiOperation({ summary: "Unpublish a car" })
  @ApiParam({ name: "id", description: "Car Id", type: "number" })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Patch("/unpublish/:id")
  async unpublishCar(
    @Param("id", ParseIntPipe) id: number,
    @Query("status") status: CarStatus,
    @Req() { user: { host } }: CustomRequest,
  ) {
    const res = await this.carService.UpdateCarStatus(id, host, status);
    return res;
  }
}
