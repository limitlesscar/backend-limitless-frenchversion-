// Typeorm Imports
import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OTPTableEntity } from "../../otp/entity/otp.entity";
import { AbstractEntity } from "src/modules/database/abstract.entity";
import { USER_TYPE_ENUM } from "../enums/user-role.enum";
import { Point } from "geojson";
import { ONBOARDING_STATUS } from "../enums/user-onboarding-status.enum";
import { FcmTokenEntity } from "./fcm_token.entity";
import { BookingEntity } from "../../booking/entities/booking.entity";
import { HostEntity } from "../../host/entities/host.entity";
import { NotificationEntity } from "../../notification/entities/notification.entity";
import { UserChatsEntity } from "../../chat/entities/user_chat.entity";
import { ChatMessageEntity } from "../../chat/entities/chat_message.entity";
import { USER_NOTIFICATION_PREFERENCE } from "../enums/notification-preference";

// Enum Imports

// Entity Imports

@Entity("user")
export class UserEntity extends AbstractEntity {
  // ======================================== Columns ========================================

  @Column({ type: "varchar" })
  first_name: string;

  @Column({ type: "varchar" })
  last_name: string;

  @Column({ type: "varchar" })
  @Index()
  full_name: string;

  @Column({ type: "varchar" })
  @Index()
  email: string;

  @Column({ type: "varchar", nullable: true })
  @Index()
  stripe_customer_id: string;

  @Column({ type: "varchar" })
  @Index()
  phone_number: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "enum", enum: USER_TYPE_ENUM, array: true })
  @Index()
  user_type: USER_TYPE_ENUM[];

  @Column({ type: "enum", enum: ONBOARDING_STATUS, nullable: true })
  user_onboarding_status: ONBOARDING_STATUS;
  @Column({ type: "enum", enum: ONBOARDING_STATUS, nullable: true })
  host_onboarding_status: ONBOARDING_STATUS;

  @Column({ type: "varchar", nullable: true })
  date_of_birth: string;

  @Column({ type: "varchar", nullable: true })
  profile_picture: string;

  @Column({ type: "varchar", nullable: true })
  id_card_front: string;

  @Column({ type: "varchar", nullable: true })
  emergency_contact: string;

  @Column({ type: "varchar", nullable: true })
  id_card_back: string;

  @Column({ type: "varchar", nullable: true })
  country: string;

  @Column({ type: "varchar", nullable: true })
  city: string;

  @Column({ type: "varchar", nullable: true })
  address: string;

  @Column({ type: "varchar", nullable: true })
  license_number: string;

  @Column({ type: "varchar", nullable: true })
  license_image: string;

  @Column({ type: "varchar", nullable: true })
  expiry_date: string;

  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  @Column({ type: "boolean", default: false })
  is_rejected: boolean;

  @Column({ type: "varchar", nullable: true })
  rejection_reason: string;

  @Column({
    type: "enum",
    enum: USER_NOTIFICATION_PREFERENCE,
    default: USER_NOTIFICATION_PREFERENCE.PUSH,
  })
  notification_preference: USER_NOTIFICATION_PREFERENCE;

  // ======================================== Relations ========================================

  /**
   * 1. One-to-many with OTPTableEntity
   * 2. One-to-One with HostEntity
   * 3. One-to-many with FcmTokenEntity
   */

  // One-to-Many relation with otps
  @OneToMany(() => OTPTableEntity, (otp) => otp.user, { cascade: true })
  otps: OTPTableEntity[];

  // ONE-to-one relation with host
  @OneToOne(() => HostEntity, (host) => host.user, { cascade: true })
  host: HostEntity;

  // One-to-Many relation with fcm_token
  @OneToMany(() => FcmTokenEntity, (fcm) => fcm.user)
  fcm_token: FcmTokenEntity[];

  // One-to-Many relation with booking
  @OneToMany(() => BookingEntity, (booking) => booking.user)
  bookings: BookingEntity[];

  // One-to-Many relation with notifications
  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  // Many-to-One relation with user_chats
  @ManyToOne(() => UserChatsEntity, (user_chat) => user_chat.user, {
    nullable: true,
  })
  chats: UserChatsEntity[];

  // One-to-Many relation with messages
  @OneToMany(() => ChatMessageEntity, (messages) => messages.sender)
  messages: ChatMessageEntity[];
}
