import { CarService } from "./car.service";
import { RegisterCarDto } from "./dto/register-car.dto";
import { CustomRequest } from "src/types/common.type";
import { EditCarDto } from "./dto/edit-car.dto";
import { PaginationDto } from "src/types/pagination/common.dto";
import { FilterCarDto } from "./dto/filter-car.dto";
import { BookingService } from "../booking/booking.service";
import { ChatTypeDto } from "./dto/logged-in-userid.dto";
import { CarStatus } from "./enums/car-status.enum";
export declare class CarController {
    private readonly carService;
    private readonly bookingService;
    constructor(carService: CarService, bookingService: BookingService);
    getMyCars({ user: { host } }: CustomRequest, paginationDto: PaginationDto): Promise<{
        cars: import("./entities/car.entity").CarEntity[];
        hasMore: boolean;
    }>;
    filterCars(filterCarDto: FilterCarDto, authHeader: string): Promise<{
        cars: import("./entities/car.entity").CarEntity[];
        hasMore: boolean;
    }>;
    listAllCarBookings(id: number): Promise<{
        id: number;
        start_date: string;
        start_time: string;
        end_date: string;
        end_time: string;
    }[]>;
    getCarsForMap(authHeader: string): Promise<import("./entities/car.entity").CarEntity[]>;
    getCarById(id: number, { chat_type }: ChatTypeDto, authHeader: string): Promise<{
        car: object;
        starsbyCount: import("./interfaces/stars-by-count.interface").StarsByCount;
        chat?: import("../chat/entities/chat.entity").ChatEntity;
    }>;
    getCarByIdforMap(id: number): Promise<object>;
    Register(registerCarDto: RegisterCarDto, { user }: CustomRequest): Promise<{
        message: string;
        car: import("./entities/car.entity").CarEntity;
    }>;
    updateCarDetails(editCarDto: EditCarDto, id: number, { user: { host } }: CustomRequest): Promise<{
        message: string;
        is_pending_booking: boolean;
        car: import("./entities/car.entity").CarEntity;
    }>;
    unpublishCar(id: number, status: CarStatus, { user: { host } }: CustomRequest): Promise<{
        message: string;
        is_unpublished?: boolean;
        is_republished?: boolean;
    }>;
}
