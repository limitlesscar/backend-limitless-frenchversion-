// Type-orm Imports
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

// Entities
import { UserEntity } from "../../user/entities/user.entity";
import { OTP_REASON_ENUM } from "../enums/otp-reason.enum";

// Enums

@Entity("otp")
export class OTPTableEntity {
  // ====================================== Columns ======================================

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "int" })
  otp: number;

  @Column({ type: "varchar", enum: OTP_REASON_ENUM })
  type: string;

  @Column({ type: "boolean", default: false })
  is_used: boolean;

  @Column({ type: "boolean", default: false })
  is_expired: boolean;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
  // ====================================== Relations ======================================

  /**
   * 1. Many-to-one relation with user
   */

  // Many-to-one relation with user
  @ManyToOne(() => UserEntity, (user) => user.otps)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}
