import { CarRepository } from "./repositories/car.repository";
import { CarEntity } from "./entities/car.entity";
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, FindOptionsOrder } from "typeorm";
import { GeocodingService } from "src/modules/core/google/geocoding/geocoding.service";
import { RegisterCarDto } from "./dto/register-car.dto";
import { PaginationDto } from "src/types/pagination/common.dto";
import { EditCarDto } from "./dto/edit-car.dto";
import { BookingService } from "../booking/booking.service";
import { HostEntity } from "../host/entities/host.entity";
import { FilterCarDto } from "./dto/filter-car.dto";
import { HostService } from "../host/host.service";
import { StarsByCount } from "./interfaces/stars-by-count.interface";
import { ChatService } from "../chat/chat.service";
import { ChatEntity } from "../chat/entities/chat.entity";
import { ChatType } from "../chat/enums/chat-type.enum";
import { CarDetails } from "./interfaces/car-details.interface";
import { UserService } from "../user/user.service";
import { CarStatus } from "./enums/car-status.enum";
import { UserEntity } from "../user/entities/user.entity";
export declare class CarService {
    private readonly carRepository;
    private readonly geocodingService;
    private readonly bookingService;
    private readonly hostService;
    private readonly userService;
    private readonly chatService;
    constructor(carRepository: CarRepository, geocodingService: GeocodingService, bookingService: BookingService, hostService: HostService, userService: UserService, chatService: ChatService);
    getCarFromDB({ where, select, relations, }: {
        where?: FindOptionsWhere<CarEntity>;
        select?: FindOptionsSelect<CarEntity>;
        relations?: FindOptionsRelations<CarEntity>;
    }): Promise<CarEntity>;
    getallCarsFromDB({ where, select, relations, skip, take, order, }: {
        where?: FindOptionsWhere<CarEntity>;
        select?: FindOptionsSelect<CarEntity>;
        relations?: FindOptionsRelations<CarEntity>;
        take?: number;
        skip?: number;
        order?: FindOptionsOrder<CarEntity>;
    }): Promise<[CarEntity[], number]>;
    updateCar({ data, where, relations, select, }: {
        data: Partial<CarEntity>;
        where: FindOptionsWhere<CarEntity>;
        relations?: FindOptionsRelations<CarEntity>;
        select?: FindOptionsSelect<CarEntity>;
    }): Promise<CarEntity>;
    register(data: RegisterCarDto, host_user: UserEntity): Promise<{
        message: string;
        car: CarEntity;
    }>;
    listMyCars(host: Partial<HostEntity>, { skip, take }: PaginationDto): Promise<{
        cars: CarEntity[];
        hasMore: boolean;
    }>;
    getCarDetails(carId: number, chat_type?: ChatType, token?: string, user_id?: number): Promise<{
        car: object;
        starsbyCount: StarsByCount;
        chat?: ChatEntity;
    }>;
    EditCarDetails(carId: number, data: EditCarDto, host: HostEntity): Promise<{
        message: string;
        is_pending_booking: boolean;
        car: CarEntity;
    }>;
    getCarRatingwithDetails(car_id: number): Promise<{
        car: CarDetails;
    }>;
    UpdateCarStatus(carId: number, host: HostEntity, type: CarStatus): Promise<{
        message: string;
        is_unpublished?: boolean;
        is_republished?: boolean;
    }>;
    filterCars({ vehicle_type, features, minimum_seats, total_price, less_than_five_years, gearbox, engine_type, brand, skip, take, start_date_time, end_date_time, address, }: FilterCarDto, token: string): Promise<{
        cars: CarEntity[];
        hasMore: boolean;
    }>;
    GetCarAmount(price_per_day: number, price_per_hour: number, start_date_time: string, end_date_time: string): {
        amount: number;
    };
    getCarsCordinates(token?: string): Promise<CarEntity[]>;
    getCarByIdForMap(car_id: number): Promise<Partial<object>>;
}
