import { Repository } from "typeorm";
import { BookingEntity } from "../entities/booking.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class BookingRepository extends Repository<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    bookingRepository: Repository<BookingEntity>,
  ) {
    super(
      bookingRepository.target,
      bookingRepository.manager,
      bookingRepository.queryRunner,
    );
  }
}
