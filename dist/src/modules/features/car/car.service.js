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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarService = void 0;
const common_1 = require("@nestjs/common");
const car_repository_1 = require("./repositories/car.repository");
const typeorm_1 = require("typeorm");
const httpException_1 = require("../../../utils/app/httpException");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
const axios_1 = require("axios");
const geocoding_service_1 = require("../../core/google/geocoding/geocoding.service");
const format_cordinates_into_point_1 = require("../../../utils/format-cordinates-into-point");
const booking_service_1 = require("../booking/booking.service");
const booking_status_enum_1 = require("../booking/enums/booking-status.enum");
const transmission_type_enum_1 = require("./enums/transmission-type.enum");
const host_service_1 = require("../host/host.service");
const chat_service_1 = require("../chat/chat.service");
const chat_type_enum_1 = require("../chat/enums/chat-type.enum");
const user_service_1 = require("../user/user.service");
const car_status_enum_1 = require("./enums/car-status.enum");
const user_onboarding_status_enum_1 = require("../user/enums/user-onboarding-status.enum");
const constants_1 = require("../../../types/constants");
let CarService = class CarService {
    constructor(carRepository, geocodingService, bookingService, hostService, userService, chatService) {
        this.carRepository = carRepository;
        this.geocodingService = geocodingService;
        this.bookingService = bookingService;
        this.hostService = hostService;
        this.userService = userService;
        this.chatService = chatService;
    }
    getCarFromDB({ where, select, relations, }) {
        return this.carRepository.findOne({
            where,
            select,
            relations,
        });
    }
    getallCarsFromDB({ where, select, relations, skip, take, order, }) {
        return this.carRepository.findAndCount({
            where,
            select,
            relations,
            skip,
            take,
            order,
        });
    }
    async updateCar({ data, where, relations, select, }) {
        await this.carRepository.update(where, data);
        return this.getCarFromDB({ where, relations, select });
    }
    async register(data, host_user) {
        const now = new Date(Date.now());
        if (!host_user.host ||
            (host_user &&
                host_user.host_onboarding_status !==
                    user_onboarding_status_enum_1.ONBOARDING_STATUS.VERIFICATION_PENDING)) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INCOMPLETE_HOST_PROFILE], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (host_user?.is_rejected) {
            (0, httpException_1.throwHttpException)(["Votre profil a été rejeté, veuillez modifier votre profil et le soumettre à nouveau"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!host_user.is_rejected && !host_user.is_verified) {
            (0, httpException_1.throwHttpException)(["Votre profil est en cours de vérification, veuillez attendre l'approbation"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const decoded_start_date_time = decodeURIComponent(data?.available_start_date_time);
        const decoded_end_date_time = decodeURIComponent(data?.available_end_date_time);
        const utc_start_date = new Date(decoded_start_date_time).toISOString();
        const utc_end_date = new Date(decoded_end_date_time).toISOString();
        const start_date = new Date(utc_start_date);
        const end_date = new Date(utc_end_date);
        if (now > new Date(start_date) || now > new Date(end_date)) {
            (0, httpException_1.throwHttpException)(["La disponibilité de la voiture ne doit pas inclure de dates passées"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const availability_start_date_time_day = start_date.getDay();
        const availability_end_date_time_day = end_date.getDay();
        if (availability_end_date_time_day === availability_start_date_time_day) {
            const twelve_hours = 12 * 60 * 60 * 1000;
            if (end_date.getTime() - start_date.getTime() < twelve_hours) {
                (0, httpException_1.throwHttpException)(["La disponibilité de la voiture ne doit pas être inférieure à 12 heures"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (start_date >= end_date) {
            (0, httpException_1.throwHttpException)(["Dates de disponibilité de la voiture invalides"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
        const pickupCordinates = await this.geocodingService.geocode(data.pickup_address);
        let pickup_point;
        let dropoff_point;
        if (pickupCordinates) {
            pickup_point = (0, format_cordinates_into_point_1.formatCoordinatesIntoPoint)(pickupCordinates.long, pickupCordinates.lat);
        }
        const dropOffCordinates = await this.geocodingService.geocode(data.dropoff_address);
        if (dropOffCordinates) {
            dropoff_point = (0, format_cordinates_into_point_1.formatCoordinatesIntoPoint)(dropOffCordinates.long, dropOffCordinates.lat);
        }
        const car = this.carRepository.create({
            ...data,
            available_start_date_time: utc_start_date,
            available_end_date_time: utc_end_date,
            pickup_location: pickup_point,
            dropoff_location: dropoff_point,
            host: host_user.host,
        });
        const created = await this.carRepository.save(car);
        return {
            message: "Voiture enregistrée avec succès",
            car: created,
        };
    }
    async listMyCars(host, { skip, take }) {
        try {
            take = Number(take);
            skip = Number(skip);
            const [cars, total] = await this.getallCarsFromDB({
                where: { host: { id: host.id } },
                select: {
                    id: true,
                    name: true,
                    images: true,
                    price_per_day: true,
                    price_per_hour: true,
                    is_unpublished: true,
                    createdAt: true,
                },
                skip,
                take,
                order: { createdAt: "DESC" },
            });
            const hasMore = total > skip + cars.length;
            return { cars, hasMore };
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.ERROR_IN_LISTING_MY_CARS], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCarDetails(carId, chat_type, token, user_id) {
        try {
            const car = await this.getCarFromDB({
                where: { id: carId },
                select: {
                    bookings: {
                        id: true,
                        stars: true,
                        review_message: true,
                        createdAt: true,
                        is_rating_pending: true,
                        user: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            full_name: true,
                        },
                        host: { id: true, user: { id: true } },
                    },
                },
                relations: { bookings: { user: true }, host: { user: true } },
            });
            if (!car) {
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CAR_NOT_FOUND], axios_1.HttpStatusCode.NotFound, common_1.HttpStatus.NOT_FOUND);
            }
            if (car.bookings?.length > 0) {
                car.bookings = car.bookings.filter((booking) => !booking.is_rating_pending);
            }
            const host = await this.hostService.getHostWithStars(car?.host?.id);
            const starsbyCount = this.bookingService.calculateStarsByBookings(car?.bookings);
            const pickup_location = (0, format_cordinates_into_point_1.formatCoordinatesIntoObject)(car.pickup_location?.coordinates);
            const dropoff_location = (0, format_cordinates_into_point_1.formatCoordinatesIntoObject)(car.pickup_location?.coordinates);
            const transformed = {
                ...car,
                ...host,
                pickup_location,
                dropoff_location,
            };
            let chat;
            if (token) {
                const user_from_token = await this.userService.validateUserFromToken(token);
                chat = await this.chatService.findChatByParticipantsAndType(user_from_token.id, car?.host?.user?.id, chat_type);
            }
            if (user_id) {
                chat = await this.chatService.findChatByParticipantsAndType(user_id, car?.host?.user?.id, chat_type_enum_1.ChatType.AS_CUSTOMER);
            }
            return { car: transformed, starsbyCount, chat };
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error.response?.message || error.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async EditCarDetails(carId, data, host) {
        try {
            const car = await this.getCarFromDB({
                where: { id: carId, host: { id: host.id } },
            });
            if (!car) {
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CAR_NOT_FOUND], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const pendingBooking = await this.bookingService.getBookingFromDB({
                where: {
                    car: { id: carId },
                    status: (0, typeorm_1.In)([booking_status_enum_1.BookingStatus.ONGOING, booking_status_enum_1.BookingStatus.UPCOMING]),
                },
            });
            if (pendingBooking) {
                (0, httpException_1.throwHttpException)(["Vous ne pouvez pas modifier les détails de la voiture tant qu'une réservation est en attente"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const decoded_start_date_time = decodeURIComponent(data?.available_start_date_time);
            const decoded_end_date_time = decodeURIComponent(data?.available_end_date_time);
            const now = new Date();
            const start_date = new Date(decoded_start_date_time);
            const end_date = new Date(decoded_end_date_time);
            if (now > start_date || now > end_date) {
                (0, httpException_1.throwHttpException)(["La disponibilité de la voiture ne doit pas contenir de dates passées"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const availability_start_date_time_day = start_date.getDay();
            const availability_end_date_time_day = end_date.getDay();
            if (availability_end_date_time_day === availability_start_date_time_day) {
                const twelve_hours = 12 * 60 * 60 * 1000;
                if (end_date.getTime() - start_date.getTime() < twelve_hours) {
                    (0, httpException_1.throwHttpException)(["La disponibilité de la voiture ne doit pas être inférieure à 12 heures"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            if (start_date >= end_date) {
                (0, httpException_1.throwHttpException)(["Dates de disponibilité de la voiture invalides"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const pickupCordinates = await this.geocodingService.geocode(data.pickup_address);
            const utc_start_date = start_date.toISOString();
            const utc_end_date = end_date.toISOString();
            let pickup_point;
            let dropoff_point;
            if (pickupCordinates) {
                pickup_point = (0, format_cordinates_into_point_1.formatCoordinatesIntoPoint)(pickupCordinates.long, pickupCordinates.lat);
            }
            const dropOffCordinates = await this.geocodingService.geocode(data.dropoff_address);
            if (dropOffCordinates) {
                dropoff_point = (0, format_cordinates_into_point_1.formatCoordinatesIntoPoint)(dropOffCordinates.long, dropOffCordinates.lat);
            }
            const updatedCar = await this.updateCar({
                data: {
                    ...data,
                    pickup_location: pickup_point,
                    dropoff_location: dropoff_point,
                    available_start_date_time: utc_start_date,
                    available_end_date_time: utc_end_date,
                },
                where: { id: carId },
            });
            return {
                message: "Détails de la voiture mis à jour avec succès",
                is_pending_booking: false,
                car: updatedCar,
            };
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(error.response?.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCarRatingwithDetails(car_id) {
        const cars = this.carRepository
            .createQueryBuilder("car")
            .where("car.id= :car_id", { car_id })
            .leftJoinAndSelect("car.bookings", "carBookings")
            .leftJoinAndSelect("booking", "booking")
            .select([
            `car.id id`,
            `car.name name`,
            `car.pickup_address pickup_address`,
            `jsonb_build_object('long', ST_X(car.pickup_location::geometry), 'lat', ST_Y(car.pickup_location::geometry)) as pickup_location`,
            `(
            SELECT ROUND(SUM(booking.stars) * 1.0 / COUNT(DISTINCT booking.id), 2)::float
            FROM booking
            WHERE booking.car_id = car.id
              AND booking.status = :completedStatus
    ) as stars`,
        ])
            .groupBy(`car.id`)
            .setParameters({
            completedStatus: booking_status_enum_1.BookingStatus.COMPLETED,
        });
        const rawCars = await cars.getRawOne();
        return { car: rawCars };
    }
    async UpdateCarStatus(carId, host, type) {
        try {
            const car = await this.getCarFromDB({
                where: { id: carId, host: { id: host.id } },
            });
            if (!car) {
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.CAR_NOT_FOUND], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            switch (type) {
                case car_status_enum_1.CarStatus.UNPUBLISH:
                    const pendingBooking = await this.bookingService.getBookingFromDB({
                        where: {
                            car: { id: carId },
                            status: (0, typeorm_1.In)([booking_status_enum_1.BookingStatus.ONGOING, booking_status_enum_1.BookingStatus.UPCOMING]),
                        },
                    });
                    if (pendingBooking) {
                        return {
                            message: "Votre voiture sera dépubliée après la fin de toutes vos réservations en cours ou à venir",
                            is_unpublished: false,
                        };
                    }
                    await this.updateCar({
                        data: { is_unpublished: true },
                        where: { id: carId },
                    });
                    return {
                        message: "Votre voiture a été dépubliée avec succès",
                        is_unpublished: true,
                    };
                case car_status_enum_1.CarStatus.REPUBLISH:
                    if (!car.is_unpublished) {
                        (0, httpException_1.throwHttpException)(["La voiture est déjà publiée"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
                    }
                    await this.updateCar({
                        data: { is_unpublished: false },
                        where: { id: carId },
                    });
                    return {
                        message: "Votre voiture a été republiée avec succès",
                        is_republished: true,
                    };
            }
        }
        catch (error) {
            (0, httpException_1.throwHttpException)(error.response?.message, axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async filterCars({ vehicle_type, features, minimum_seats, total_price, less_than_five_years, gearbox, engine_type, brand, skip, take, start_date_time, end_date_time, address, }, token) {
        try {
            skip = Number(skip);
            take = Number(take);
            typeof features == "string" ? (features = [features]) : features;
            typeof vehicle_type == "string"
                ? (vehicle_type = [vehicle_type])
                : vehicle_type;
            typeof brand == "string" ? (brand = [brand]) : brand;
            let cordinates;
            if (address) {
                cordinates = await this.geocodingService.geocode(address);
            }
            const cars = this.carRepository
                .createQueryBuilder("car")
                .where("car.is_unpublished=false")
                .innerJoin("car.host", "host")
                .leftJoinAndSelect("host.user", "user")
                .leftJoinAndSelect("car.bookings", "carBookings")
                .leftJoinAndSelect("booking", "booking")
                .select([
                `car.id id`,
                `car.name name`,
                "car.images as images",
                "car.price_per_day as price_per_day",
                "car.price_per_hour as price_per_hour",
                "car.transmission_type transmission_type",
                "car.available_start_date_time as available_start_date_time",
                "car.available_end_date_time as available_end_date_time",
                `json_build_object('id',host.id,'host_user_id',"user"."id",'full_name',"user"."full_name",'profile_picture',"user"."profile_picture",'address',"user"."address",
    'stars',(SELECT ROUND(SUM(booking.stars) * 1.0 / COUNT(DISTINCT booking.id), 2)
            FROM booking
            WHERE booking.host_id = host.id
              AND booking.status = :completedStatus
        )) as host`,
                `jsonb_build_object('long', ST_X(car.pickup_location::geometry), 'lat', ST_Y(car.pickup_location::geometry)) as pickup_location`,
                `jsonb_build_object('long', ST_X(car.dropoff_location::geometry), 'lat', ST_Y(car.dropoff_location::geometry)) as dropoff_location`,
                `(
            SELECT ROUND(SUM(booking.stars) * 1.0 / COUNT(DISTINCT booking.id), 2)::float
            FROM booking
            WHERE booking.car_id = car.id
              AND booking.status = :completedStatus
    ) as stars`,
            ])
                .groupBy(`car.id,host.id,"user"."id"`)
                .setParameters({
                completedStatus: booking_status_enum_1.BookingStatus.COMPLETED,
            });
            if (token) {
                const user_from_token = await this.userService.validateUserFromToken(token);
                if (user_from_token?.host?.id) {
                    cars.andWhere("host.id <> :host_id", {
                        host_id: user_from_token?.host?.id,
                    });
                }
                if (user_from_token.location) {
                    const user_coordinates = await this.userService.convertPointToCoordinates(user_from_token);
                    if (user_coordinates &&
                        user_coordinates.lat &&
                        user_coordinates.long) {
                        cars.andWhere("ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 50000)", {
                            latitude: user_coordinates.lat,
                            longitude: user_coordinates.long,
                        });
                    }
                    else {
                        cars.andWhere("ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 100000)", {
                            latitude: constants_1.parisCoordinates.lat,
                            longitude: constants_1.parisCoordinates.long,
                        });
                    }
                }
            }
            if (vehicle_type) {
                cars.andWhere("car.vehicle_type In (:...vehicle_type)", {
                    vehicle_type,
                });
            }
            if (features) {
                cars.andWhere("car.features @> :features", {
                    features,
                });
            }
            if (minimum_seats) {
                cars.andWhere("car.maximum_passengers>=:minimum_seats", {
                    minimum_seats,
                });
            }
            if (total_price) {
                cars.andWhere("car.price_per_day<=:total_price", { total_price });
            }
            if (less_than_five_years) {
                cars.andWhere("date_part('year', CURRENT_DATE) - date_part('year', car.createdAt) < 5");
            }
            if (gearbox && gearbox != transmission_type_enum_1.TransmissionType.ALL) {
                cars.andWhere("car.transmission_type = :gearbox", { gearbox });
            }
            if (engine_type) {
                cars.andWhere("car.engine_type = :engine_type", { engine_type });
            }
            if (brand) {
                cars.andWhere("car.brand In (:...brand)", { brand });
            }
            if (address && cordinates.lat && cordinates.long) {
                cars.andWhere("ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 100000)", {
                    latitude: cordinates.lat,
                    longitude: cordinates.long,
                });
            }
            if (!token && (!address || !cordinates.lat || !cordinates.long)) {
                cars.andWhere("ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 100000)", {
                    latitude: constants_1.parisCoordinates.lat,
                    longitude: constants_1.parisCoordinates.long,
                });
            }
            if (start_date_time && end_date_time) {
                const decoded_start_date_time = decodeURIComponent(start_date_time);
                const decoded_end_date_time = decodeURIComponent(end_date_time);
                const start_date = new Date(decoded_start_date_time).toISOString();
                const end_date = new Date(decoded_end_date_time).toISOString();
                if (start_date > end_date) {
                    (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.INVALID_START_END_DATE_TIME], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
                }
                cars.andWhere("car.available_start_date_time <= :start_date_time AND car.available_end_date_time >= :end_date_time", {
                    start_date_time: start_date,
                    end_date_time: end_date,
                });
            }
            cars.offset(skip);
            cars.limit(take);
            const res = await cars.getRawMany();
            const total = await cars.getCount();
            const hasMore = total > skip + res.length;
            return {
                cars: res,
                hasMore,
            };
        }
        catch (error) {
            console.log(error);
            (0, httpException_1.throwHttpException)(["Error in filtering cars"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    GetCarAmount(price_per_day, price_per_hour, start_date_time, end_date_time) {
        try {
            let amount;
            const durationInMs = new Date(end_date_time).getTime() - new Date(start_date_time).getTime();
            const durationInHours = durationInMs / (1000 * 60 * 60);
            const fullDays = Math.floor(durationInHours / 24);
            const remainingHours = durationInHours % 24;
            if (fullDays >= 1) {
                amount = price_per_day * fullDays;
                if (remainingHours > 0) {
                    amount += price_per_hour * remainingHours;
                }
            }
            else {
                amount = price_per_hour * durationInHours;
            }
            return { amount };
        }
        catch (error) {
            console.error("Error in calculating car amount", error);
            (0, httpException_1.throwHttpException)(["Error in calculating car amount"], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCarsCordinates(token) {
        try {
            const cars = this.carRepository.createQueryBuilder("car");
            cars.where("car.isBooked=false and car.is_unpublished=false");
            cars.orderBy("car.createdAt", "DESC");
            cars.select([
                "car.id as id",
                "car.createdAt as createdAt",
                `jsonb_build_object('long', ST_X(car.pickup_location::geometry), 'lat', ST_Y(car.pickup_location::geometry)) as pickup_location`,
            ]);
            if (token) {
                const user_from_token = await this.userService.validateUserFromToken(token);
                if (user_from_token.location) {
                    const user_coordinates = await this.userService.convertPointToCoordinates(user_from_token);
                    if (user_coordinates &&
                        user_coordinates.lat &&
                        user_coordinates.long) {
                        cars.andWhere("ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 500000)", {
                            latitude: user_coordinates.lat,
                            longitude: user_coordinates.long,
                        });
                    }
                }
            }
            else {
                cars.andWhere("ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 100000)", {
                    latitude: constants_1.parisCoordinates.lat,
                    longitude: constants_1.parisCoordinates.long,
                });
            }
            return await cars.getRawMany();
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error.response?.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCarByIdForMap(car_id) {
        try {
            const car = await this.getCarFromDB({
                where: { id: car_id },
                select: {
                    id: true,
                    name: true,
                    images: true,
                    price_per_day: true,
                    price_per_hour: true,
                    createdAt: true,
                },
                relations: { host: true },
            });
            const hostWIthStars = await this.hostService.getHostWithStars(car?.host?.id);
            return { ...car, host: hostWIthStars };
        }
        catch (error) {
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.ERROR_IN_LISTING_MY_CARS], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.CarService = CarService;
exports.CarService = CarService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => booking_service_1.BookingService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [car_repository_1.CarRepository,
        geocoding_service_1.GeocodingService,
        booking_service_1.BookingService,
        host_service_1.HostService,
        user_service_1.UserService,
        chat_service_1.ChatService])
], CarService);
//# sourceMappingURL=car.service.js.map