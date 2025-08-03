import { AbstractEntity } from "src/modules/database/abstract.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CarEntity } from "src/modules/features/car/entities/car.entity";
import { BookingEntity } from "src/modules/features/booking/entities/booking.entity";
import { UserEntity } from "../../user/entities/user.entity";
@Entity("host")
export class HostEntity extends AbstractEntity {
  @Column({ type: "text", nullable: true, unique: true })
  stripe_account_id: string;

  @Column({ type: "text", nullable: true, unique: true })
  stripe_link: string;

  @Column({ type: "text", nullable: true, unique: true })
  dashboard_login_link: string;

  //   ========================================= Relations ========================================
  @OneToOne(() => UserEntity, (user) => user.host)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserEntity;

  @OneToMany(() => CarEntity, (car) => car.host)
  cars: CarEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.host)
  bookings: BookingEntity[];
}
