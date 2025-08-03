import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CarRepository } from "./repositories/car.repository";
import { CarEntity } from "./entities/car.entity";
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
  FindOptionsOrder,
  In,
} from "typeorm";
import { throwHttpException } from "src/utils/app/httpException";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { HttpStatusCode } from "axios";
import { GeocodingService } from "src/modules/core/google/geocoding/geocoding.service";
import { RegisterCarDto } from "./dto/register-car.dto";
import {
  formatCoordinatesIntoObject,
  formatCoordinatesIntoPoint,
} from "src/utils/format-cordinates-into-point";
import { Point } from "geojson";
import { PaginationDto } from "src/types/pagination/common.dto";
import { EditCarDto } from "./dto/edit-car.dto";
import { BookingService } from "../booking/booking.service";
import { BookingStatus } from "../booking/enums/booking-status.enum";
import { HostEntity } from "../host/entities/host.entity";
import { FilterCarDto } from "./dto/filter-car.dto";
import { Coordinates } from "src/types/common.type";
import { TransmissionType } from "./enums/transmission-type.enum";
import { HostService } from "../host/host.service";
import { StarsByCount } from "./interfaces/stars-by-count.interface";
import { ChatService } from "../chat/chat.service";
import { ChatEntity } from "../chat/entities/chat.entity";
import { ChatType } from "../chat/enums/chat-type.enum";
import { CarDetails } from "./interfaces/car-details.interface";
import { UserService } from "../user/user.service";
import { CarStatus } from "./enums/car-status.enum";
import { UserEntity } from "../user/entities/user.entity";
import { ONBOARDING_STATUS } from "../user/enums/user-onboarding-status.enum";
import { parisCoordinates } from "src/types/constants";

@Injectable()
export class CarService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly geocodingService: GeocodingService,
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
    private readonly hostService: HostService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly chatService: ChatService
  ) {}
  // ============================================= GET CAR BY WHERE CLAUSE =============================================

  /**
   * Retrieves a single `CarEntity` from the database based on the provided criteria.
   *
   * @param {Object} options - An object containing the parameters for the database query.
   * @param {FindOptionsWhere<CarEntity>} [options.where] - An optional object specifying the criteria to find the car.
   * @param {FindOptionsSelect<CarEntity>} [options.select] - An optional parameter specifying the fields to be selected from the car entity.
   * @param {FindOptionsRelations<CarEntity>} [options.relations] - An optional parameter specifying the relations to be loaded for the car entity.
   * @returns {Promise<CarEntity>} - A Promise that resolves to the retrieved `CarEntity`.
   */
  getCarFromDB({
    where,
    select,
    relations,
  }: {
    where?: FindOptionsWhere<CarEntity>;
    select?: FindOptionsSelect<CarEntity>;
    relations?: FindOptionsRelations<CarEntity>;
  }): Promise<CarEntity> {
    return this.carRepository.findOne({
      where,
      select,
      relations,
    });
  }
  // ============================================= GET ALL CARS BY WHERE CLAUSE =============================================

  /**
   * Retrieves all `CarEntity` instances from the database based on the provided criteria.
   *
   * @param {Object} options - An object containing the parameters for the database query.
   * @param {FindOptionsWhere<CarEntity>} [options.where] - An optional object specifying the criteria to find the cars.
   * @param {FindOptionsSelect<CarEntity>} [options.select] - An optional parameter specifying the fields to be selected from the car entities.
   * @param {FindOptionsRelations<CarEntity>} [options.relations] - An optional parameter specifying the relations to be loaded for the car entities.
   * @returns {Promise<[CarEntity[], number]>} - A Promise that resolves to an array of `CarEntity` instances and the total count of matching cars.
   */
  getallCarsFromDB({
    where,
    select,
    relations,
    skip,
    take,
    order,
  }: {
    where?: FindOptionsWhere<CarEntity>;
    select?: FindOptionsSelect<CarEntity>;
    relations?: FindOptionsRelations<CarEntity>;
    take?: number;
    skip?: number;
    order?: FindOptionsOrder<CarEntity>;
  }): Promise<[CarEntity[], number]> {
    return this.carRepository.findAndCount({
      where,
      select,
      relations,
      skip,
      take,
      order,
    });
  }

  /**
   * Updates a car in the database based on the provided criteria.
   *
   * @param {Object} options - An object containing the parameters for the database update.
   * @param {Partial<CarEntity>} options.data - The partial data to update the car with.
   * @param {FindOptionsWhere<CarEntity>} options.where - The criteria to find the car to update.
   * @param {FindOptionsRelations<CarEntity>} [options.relations] - The relations to load for the updated car.
   * @param {FindOptionsSelect<CarEntity>} [options.select] - The fields to select for the updated car.
   * @returns {Promise<CarEntity>} - A Promise that resolves to the updated `CarEntity`.
   */
  async updateCar({
    data,
    where,
    relations,
    select,
  }: {
    data: Partial<CarEntity>;
    where: FindOptionsWhere<CarEntity>;
    relations?: FindOptionsRelations<CarEntity>;
    select?: FindOptionsSelect<CarEntity>;
  }): Promise<CarEntity> {
    await this.carRepository.update(where, data);
    return this.getCarFromDB({ where, relations, select });
  }

  /**
   * Creates a new `CarEntity` instance in the database.
   *
   * @param {Partial<CarEntity>} data - A partial object containing the data for the new car.
   * @returns {Promise<CarEntity>} - A Promise that resolves to the newly created `CarEntity`.
   */
  async register(
    data: RegisterCarDto,
    host_user: UserEntity
  ): Promise<{ message: string; car: CarEntity }> {
    // ADD POINT TYPE FOR LOCATION
    const now = new Date(Date.now());
    if (
      !host_user.host ||
      (host_user &&
        host_user.host_onboarding_status !==
          ONBOARDING_STATUS.VERIFICATION_PENDING)
    ) {
      throwHttpException(
        [ErrorMessages.INCOMPLETE_HOST_PROFILE],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
    if (host_user?.is_rejected) {
      throwHttpException(
        ["Votre profil a été rejeté, veuillez modifier votre profil et le soumettre à nouveau"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
    if (!host_user.is_rejected && !host_user.is_verified) {
      throwHttpException(
        ["Votre profil est en cours de vérification, veuillez attendre l'approbation"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }

    const decoded_start_date_time = decodeURIComponent(
      data?.available_start_date_time
    );
    const decoded_end_date_time = decodeURIComponent(
      data?.available_end_date_time
    );
    const utc_start_date = new Date(decoded_start_date_time).toISOString();
    const utc_end_date = new Date(decoded_end_date_time).toISOString();
    const start_date = new Date(utc_start_date);
    const end_date = new Date(utc_end_date);

    if (now > new Date(start_date) || now > new Date(end_date)) {
      throwHttpException(
        ["La disponibilité de la voiture ne doit pas inclure de dates passées"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
    const availability_start_date_time_day = start_date.getDay();
    const availability_end_date_time_day = end_date.getDay();
    if (availability_end_date_time_day === availability_start_date_time_day) {
      const twelve_hours = 12 * 60 * 60 * 1000;
      if (end_date.getTime() - start_date.getTime() < twelve_hours) {
        throwHttpException(
          ["La disponibilité de la voiture ne doit pas être inférieure à 12 heures"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (start_date >= end_date) {
      throwHttpException(
        ["Dates de disponibilité de la voiture invalides"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }

    const pickupCordinates = await this.geocodingService.geocode(
      data.pickup_address
    );
    let pickup_point: Point;
    let dropoff_point: Point;
    if (pickupCordinates) {
      pickup_point = formatCoordinatesIntoPoint(
        pickupCordinates.long,
        pickupCordinates.lat
      );
    }
    const dropOffCordinates = await this.geocodingService.geocode(
      data.dropoff_address
    );
    if (dropOffCordinates) {
      dropoff_point = formatCoordinatesIntoPoint(
        dropOffCordinates.long,
        dropOffCordinates.lat
      );
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
  // ============================================= LIST MY CARS =============================================
  async listMyCars(
    host: Partial<HostEntity>,
    { skip, take }: PaginationDto
  ): Promise<{ cars: CarEntity[]; hasMore: boolean }> {
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
    } catch (error) {
      throwHttpException(
        [ErrorMessages.ERROR_IN_LISTING_MY_CARS],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // ============================================= GET CAR DETAILS=============================================
  async getCarDetails(
    carId: number,
    chat_type?: ChatType,
    token?: string,
    user_id?: number
  ): Promise<{
    car: object;
    starsbyCount: StarsByCount;
    chat?: ChatEntity;
  }> {
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
        throwHttpException(
          [ErrorMessages.CAR_NOT_FOUND],
          HttpStatusCode.NotFound,
          HttpStatus.NOT_FOUND
        );
      }
      if (car.bookings?.length > 0) {
        car.bookings = car.bookings.filter(
          (booking) => !booking.is_rating_pending
        );
      }
      const host: Partial<HostEntity> = await this.hostService.getHostWithStars(
        car?.host?.id
      );
      const starsbyCount = this.bookingService.calculateStarsByBookings(
        car?.bookings
      );
      const pickup_location = formatCoordinatesIntoObject(
        car.pickup_location?.coordinates
      );

      const dropoff_location = formatCoordinatesIntoObject(
        car.pickup_location?.coordinates
      );

      const transformed = {
        ...car,
        ...host,
        pickup_location,
        dropoff_location,
      };
      let chat: ChatEntity;
      if (token) {
        const user_from_token =
          await this.userService.validateUserFromToken(token);
        chat = await this.chatService.findChatByParticipantsAndType(
          user_from_token.id,
          car?.host?.user?.id,
          chat_type
        );
      }
      if (user_id) {
        chat = await this.chatService.findChatByParticipantsAndType(
          user_id,
          car?.host?.user?.id,
          ChatType.AS_CUSTOMER
        );
      }
      return { car: transformed, starsbyCount, chat };
    } catch (error) {
      console.log(error);
      throwHttpException(
        error.response?.message || error.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  // ============================================= EDIT CAR DETAILS=============================================
  async EditCarDetails(
    carId: number,
    data: EditCarDto,
    host: HostEntity
  ): Promise<{ message: string; is_pending_booking: boolean; car: CarEntity }> {
    try {
      const car = await this.getCarFromDB({
        where: { id: carId, host: { id: host.id } },
      });
      if (!car) {
        throwHttpException(
          [ErrorMessages.CAR_NOT_FOUND],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST
        );
      }
      const pendingBooking = await this.bookingService.getBookingFromDB({
        where: {
          car: { id: carId },
          status: In([BookingStatus.ONGOING, BookingStatus.UPCOMING]),
        },
      });
      if (pendingBooking) {
        throwHttpException(
          ["Vous ne pouvez pas modifier les détails de la voiture tant qu'une réservation est en attente"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST
        );
      }

      const decoded_start_date_time = decodeURIComponent(
        data?.available_start_date_time
      );
      const decoded_end_date_time = decodeURIComponent(
        data?.available_end_date_time
      );

      const now = new Date();
      const start_date = new Date(decoded_start_date_time);
      const end_date = new Date(decoded_end_date_time);

      if (now > start_date || now > end_date) {
        throwHttpException(
          ["La disponibilité de la voiture ne doit pas contenir de dates passées"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST
        );
      }
      const availability_start_date_time_day = start_date.getDay();
      const availability_end_date_time_day = end_date.getDay();
      if (availability_end_date_time_day === availability_start_date_time_day) {
        const twelve_hours = 12 * 60 * 60 * 1000;
        if (end_date.getTime() - start_date.getTime() < twelve_hours) {
          throwHttpException(
            ["La disponibilité de la voiture ne doit pas être inférieure à 12 heures"],
            HttpStatusCode.BadRequest,
            HttpStatus.BAD_REQUEST
          );
        }
      }

      if (start_date >= end_date) {
        throwHttpException(
          ["Dates de disponibilité de la voiture invalides"],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST
        );
      }
      const pickupCordinates = await this.geocodingService.geocode(
        data.pickup_address
      );
      const utc_start_date = start_date.toISOString();
      const utc_end_date = end_date.toISOString();

      let pickup_point: Point;
      let dropoff_point: Point;
      if (pickupCordinates) {
        pickup_point = formatCoordinatesIntoPoint(
          pickupCordinates.long,
          pickupCordinates.lat
        );
      }
      const dropOffCordinates = await this.geocodingService.geocode(
        data.dropoff_address
      );
      if (dropOffCordinates) {
        dropoff_point = formatCoordinatesIntoPoint(
          dropOffCordinates.long,
          dropOffCordinates.lat
        );
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
    } catch (error) {
      console.log(error);
      throwHttpException(
        error.response?.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  // ============================================= CAR RATING=============================================
  async getCarRatingwithDetails(car_id: number): Promise<{ car: CarDetails }> {
    const cars = this.carRepository
      .createQueryBuilder("car")
      .where("car.id= :car_id", { car_id })

      .leftJoinAndSelect("car.bookings", "carBookings")
      .leftJoinAndSelect("booking", "booking") // Join the global booking table

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
        completedStatus: BookingStatus.COMPLETED,
      });

    const rawCars = await cars.getRawOne();
    return { car: rawCars };
  }
  // ============================================= UNPUBLISH CAR=============================================
  async UpdateCarStatus(
    carId: number,
    host: HostEntity,
    type: CarStatus
  ): Promise<{
    message: string;
    is_unpublished?: boolean;
    is_republished?: boolean;
  }> {
    try {
      const car = await this.getCarFromDB({
        where: { id: carId, host: { id: host.id } },
      });
      if (!car) {
        throwHttpException(
          [ErrorMessages.CAR_NOT_FOUND],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST
        );
      }
      switch (type) {
        case CarStatus.UNPUBLISH:
          const pendingBooking = await this.bookingService.getBookingFromDB({
            where: {
              car: { id: carId },
              status: In([BookingStatus.ONGOING, BookingStatus.UPCOMING]),
            },
          });
          if (pendingBooking) {
            return {
              message:
                "Votre voiture sera dépubliée après la fin de toutes vos réservations en cours ou à venir",
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
        case CarStatus.REPUBLISH:
          if (!car.is_unpublished) {
            throwHttpException(
              ["La voiture est déjà publiée"],
              HttpStatusCode.BadRequest,
              HttpStatus.BAD_REQUEST
            );
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
    } catch (error) {
      throwHttpException(
        error.response?.message,
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  // ============================================= FILTER CARS=============================================
  async filterCars(
    {
      vehicle_type,
      features,
      minimum_seats,
      total_price,
      less_than_five_years,
      gearbox,
      engine_type,
      brand,
      skip,
      take,
      start_date_time,
      end_date_time,
      address,
    }: FilterCarDto,
    token: string
  ): Promise<{
    cars: CarEntity[];
    hasMore: boolean;
  }> {
    try {
      skip = Number(skip);
      take = Number(take);

      typeof features == "string" ? (features = [features]) : features;
      // typeof gearbox == "string" ? (gearbox = [gearbox]) : gearbox;
      typeof vehicle_type == "string"
        ? (vehicle_type = [vehicle_type])
        : vehicle_type;
      typeof brand == "string" ? (brand = [brand]) : brand;
      let cordinates: Coordinates;
      if (address) {
        cordinates = await this.geocodingService.geocode(address);
      }

      const cars = this.carRepository
        .createQueryBuilder("car")
        .where("car.is_unpublished=false")
        // .andWhere("car.isBooked=false")
        .innerJoin("car.host", "host")

        .leftJoinAndSelect("host.user", "user")
        .leftJoinAndSelect("car.bookings", "carBookings")
        .leftJoinAndSelect("booking", "booking") // Join the global booking table

        // .andWhere(
        //   `(booking.start_date_time NOT BETWEEN :start_date_time AND :end_date_time
        // AND booking.end_date_time NOT BETWEEN :start_date_time AND :end_date_time
        // AND booking.start_date_time <= :start_date_time
        // AND booking.end_date_time >= :end_date_time)
        // OR (booking.status = :status)`,
        //   {
        //     start_date_time,
        //     end_date_time,
        //     status: BookingStatus.CANCELLED,
        //   }
        // )
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
          completedStatus: BookingStatus.COMPLETED,
        });
      if (token) {
        const user_from_token =
          await this.userService.validateUserFromToken(token);
        if (user_from_token?.host?.id) {
          cars.andWhere("host.id <> :host_id", {
            host_id: user_from_token?.host?.id,
          });
        }
        if (user_from_token.location) {
          const user_coordinates =
            await this.userService.convertPointToCoordinates(user_from_token);
          if (
            user_coordinates &&
            user_coordinates.lat &&
            user_coordinates.long
          ) {
            cars.andWhere(
              "ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 50000)",
              {
                latitude: user_coordinates.lat,
                longitude: user_coordinates.long,
              }
            );
          } else {
            cars.andWhere(
              "ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 100000)",
              {
                latitude: parisCoordinates.lat,
                longitude: parisCoordinates.long,
              }
            );
          }
        }
      }

      if (vehicle_type) {
        // console.log("VEHICHLE TYPE", vehicle_type);
        cars.andWhere("car.vehicle_type In (:...vehicle_type)", {
          vehicle_type,
        });
        // console.log("VEHICLE TYPE PART", await cars.getManyAndCount());
      }
      if (features) {
        cars.andWhere("car.features @> :features", {
          features,
        });
        // console.log("FEATURES PART", await cars.getMany());
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
        cars.andWhere(
          "date_part('year', CURRENT_DATE) - date_part('year', car.createdAt) < 5"
        );
      }
      if (gearbox && gearbox != TransmissionType.ALL) {
        cars.andWhere("car.transmission_type = :gearbox", { gearbox });
      }
      if (engine_type) {
        cars.andWhere("car.engine_type = :engine_type", { engine_type });
      }
      if (brand) {
        cars.andWhere("car.brand In (:...brand)", { brand });
      }
      if (address && cordinates.lat && cordinates.long) {
        cars.andWhere(
          "ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 100000)",
          {
            latitude: cordinates.lat,
            longitude: cordinates.long,
          }
        );
      }
      if (!token && (!address || !cordinates.lat || !cordinates.long)) {
        cars.andWhere(
          "ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 100000)",
          {
            latitude: parisCoordinates.lat,
            longitude: parisCoordinates.long,
          }
        );
      }
      if (start_date_time && end_date_time) {
        const decoded_start_date_time = decodeURIComponent(start_date_time);
        const decoded_end_date_time = decodeURIComponent(end_date_time);
        const start_date = new Date(decoded_start_date_time).toISOString();
        const end_date = new Date(decoded_end_date_time).toISOString();

        if (start_date > end_date) {
          throwHttpException(
            [ErrorMessages.INVALID_START_END_DATE_TIME],
            HttpStatusCode.BadRequest,
            HttpStatus.BAD_REQUEST
          );
        }
        cars.andWhere(
          "car.available_start_date_time <= :start_date_time AND car.available_end_date_time >= :end_date_time",
          {
            start_date_time: start_date,
            end_date_time: end_date,
          }
        );
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
    } catch (error) {
      console.log(error);
      throwHttpException(
        ["Error in filtering cars"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
    // }
  }
  GetCarAmount(
    price_per_day: number,
    price_per_hour: number,
    start_date_time: string,
    end_date_time: string
  ): { amount: number } {
    try {
      let amount: number;

      const durationInMs =
        new Date(end_date_time).getTime() - new Date(start_date_time).getTime();

      const durationInHours = durationInMs / (1000 * 60 * 60);

      const fullDays = Math.floor(durationInHours / 24);

      const remainingHours = durationInHours % 24;

      if (fullDays >= 1) {
        amount = price_per_day * fullDays;

        if (remainingHours > 0) {
          amount += price_per_hour * remainingHours;
        }
      } else {
        amount = price_per_hour * durationInHours;
      }

      return { amount };
    } catch (error) {
      console.error("Error in calculating car amount", error);
      throwHttpException(
        ["Error in calculating car amount"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async getCarsCordinates(token?: string): Promise<CarEntity[]> {
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
        const user_from_token =
          await this.userService.validateUserFromToken(token);
        if (user_from_token.location) {
          const user_coordinates =
            await this.userService.convertPointToCoordinates(user_from_token);
          if (
            user_coordinates &&
            user_coordinates.lat &&
            user_coordinates.long
          ) {
            cars.andWhere(
              "ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 500000)",
              {
                latitude: user_coordinates.lat,
                longitude: user_coordinates.long,
              }
            );
          }
        }
      } else {
        cars.andWhere(
          "ST_DWithin(car.pickup_location, ST_MakePoint(:longitude, :latitude), 100000)",
          {
            latitude: parisCoordinates.lat,
            longitude: parisCoordinates.long,
          }
        );
      }

      return await cars.getRawMany();
    } catch (error) {
      throwHttpException(
        [error.response?.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  // ============================================= Get Car by Id for Map =============================================
  async getCarByIdForMap(car_id: number): Promise<Partial<object>> {
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
      const hostWIthStars = await this.hostService.getHostWithStars(
        car?.host?.id
      );

      return { ...car, host: hostWIthStars };
    } catch (error) {
      throwHttpException(
        [ErrorMessages.ERROR_IN_LISTING_MY_CARS],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
