import { AbstractEntity } from "src/modules/database/abstract.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BookingStatus } from "../enums/booking-status.enum";
import { UserEntity } from "../../user/entities/user.entity";
import { CarEntity } from "../../car/entities/car.entity";
import { HostEntity } from "../../host/entities/host.entity";
import { BookingCancellationReason } from "../enums/cancellation-reasons.enum";

@Entity("booking")
export class BookingEntity extends AbstractEntity {
  @Column({ type: "int", default: 0 })
  stars: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  review_message: string;

  @Index()
  @Column({ type: "varchar" })
  start_date_time: string;

  @Index()
  @Column({ type: "varchar" })
  end_date_time: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "varchar", nullable: true })
  card_last_four: string;

  @Column({ type: "varchar", nullable: true })
  card_brand: string;

  @Column({ type: "varchar", nullable: true })
  payment_method_id: string;

  @Column({ type: "varchar", nullable: true })
  stripe_fees: string;

  @Column({ type: "varchar", nullable: true })
  stripe_charge_id: string;
  @Column({ type: "varchar", nullable: true })
  transfer_group: string;

  @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.ONGOING })
  status: BookingStatus;

  @Column({ type: "boolean", default: true })
  is_rating_pending: boolean;

  @Column({ type: "boolean", default: false })
  is_refunded: boolean;

  @Column({ type: "enum", enum: BookingCancellationReason, nullable: true })
  cancellation_reason: BookingCancellationReason;

  //   ======================= RELATIONS ===============================
  @ManyToOne(() => UserEntity, (user) => user.bookings)
  @Index()
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;

  @ManyToOne(() => HostEntity, (host) => host.bookings)
  @Index()
  @JoinColumn({ name: "host_id", referencedColumnName: "id" })
  host: HostEntity;

  @ManyToOne(() => CarEntity, (car) => car.bookings)
  @Index()
  @JoinColumn({ name: "car_id", referencedColumnName: "id" })
  car: CarEntity;
}
