import { HttpStatus, Injectable } from "@nestjs/common";
import { AdminRepository } from "./repositories/admin.repository";
import { comparePassword, hashPassword } from "src/utils/hashing/bcrypt";
import { LoginDTO } from "src/modules/core/auth/dto/login.dto";

import { JwtAdminService } from "src/modules/core/jwt/services/jwt-admin.service";
import { throwHttpException } from "src/utils/app/httpException";
import { HttpStatusCode } from "axios";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { GetDbUsersDTO } from "./dto/get-db-users.dto";
import { UserRepository } from "../user/repositories/user.repository";
import { Brackets } from "typeorm";
import { AdminLoginDTO } from "./dto/login.dto";
import { RejectUserDto } from "./dto/reject-user.dto";
import { UserEntity } from "../user/entities/user.entity";
import { MailService } from "src/modules/core/mail/mail.service";
import { rejectionEmailTemplate } from "src/modules/core/mail/template/user-rejection";
import { successfulReviewEmailTemplate } from "src/modules/core/mail/template/user-approval";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtAdminService: JwtAdminService,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
  ) {}

  
  

async createAdmin(data: { email: string; password: string }) {
  return await this.adminRepository.insert(data); // no hashing
}



  
async login({ email, password }: AdminLoginDTO) {
  email = email.toLowerCase();
  const admin = await this.adminRepository.findOne({
    where: { email },
  });

  if (!admin) {
    throwHttpException(
      ["Admin not found"],
      HttpStatusCode.Unauthorized,
      HttpStatus.UNAUTHORIZED,
    );
  }

  // Simple plain-text comparison
  const isPasswordValid = password === admin.password;

  if (!isPasswordValid) {
    throwHttpException(
      [ErrorMessages.INVALID_CREDENTIALS],
      HttpStatusCode.BadRequest,
      HttpStatus.BAD_REQUEST,
    );
  }

  const token = this.jwtAdminService.generateAuthToken({
    payload: { id: admin.id, email: admin.email },
  });

  return {
    message: "Login successful",
    token,
  };
}








  async UsersFromDb({ role, page, limit, search, status }: GetDbUsersDTO) {
    const skip = (page - 1) * limit;
    const take = limit ? limit : 10;
    const query = this.userRepository.createQueryBuilder("user");
    query
      .leftJoinAndSelect("user.host", "host")
      .select([
        "user.id",
        "user.full_name",
        "user.email",
        "user.phone_number",
        "user.profile_picture",
        "user.is_rejected",
        "user.user_type",
        "user.is_verified",
      ])
      .skip(skip)
      .take(take);
    if (role) {
      query.andWhere("user.user_type @> :type", { type: [role] });
    }
    if (status) {
      switch (status) {
        case "Approved":
          query.andWhere("user.is_verified = :is_verified", {
            is_verified: true,
          });
          break;
        case "Pending":
          query.andWhere(
            "user.is_verified = :is_verified and user.is_rejected =false",
            { is_verified: false },
          );
          break;
        case "Rejected":
          query.andWhere("user.is_rejected = :is_rejected", {
            is_rejected: true,
          });
          break;
        default:
          break;
      }
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where("user.full_name ILIKE :search", {
            search: `%${search}%`,
          })
            .orWhere("user.email ILIKE :search", {
              search: `%${search}%`,
            })
            .orWhere("user.phone_number ILIKE :search", {
              search: `%${search}%`,
            });
        }),
      );
    }
    const [data, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / take);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;
    return {
      data,
      total,
      totalPages,
      currentPage: page,
      nextPage,
      previousPage,
    };
  }
  async rejectUser({
    id,
    rejection_reason,
  }: RejectUserDto): Promise<{ message: string; rejectedUser: UserEntity }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        fcm_token: { id: true, token: true },
      },
      relations: { fcm_token: true },
    });
    if (!user) {
      throwHttpException(
        ["User not found"],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.is_rejected) {
      throwHttpException(
        ["User is already rejected"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.is_verified) {
      throwHttpException(
        ["User is already verified"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const [rejection] = await Promise.all([
      this.userRepository.update(id, {
        is_rejected: true,
        rejection_reason,
      }),
      this.mailService.sendMail({
        mailOptions: {
          subject: "User Profile Rejected",
          to: user.email,
          html: rejectionEmailTemplate(rejection_reason),
        },
      }),
      this.notificationService.sendAdminNotification({
        fcmTokens: user.fcm_token?.map((user) => user.token),
        message:
          "Your profile has been rejected, please check your email for more details",
      }),
    ]);

    if (!rejection.affected) {
      throwHttpException(
        ["User rejection failed"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: "User rejected successfully",
      rejectedUser: user,
    };
  }
  async approveUser(
    id: number,
  ): Promise<{ message: string; approvedUser: UserEntity }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        fcm_token: { id: true, token: true },
      },
      relations: { fcm_token: true },
    });
    if (!user) {
      throwHttpException(
        ["User not found"],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.is_verified) {
      throwHttpException(
        ["User is already verified"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.is_rejected) {
      throwHttpException(
        ["User is rejected"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }

    const [approval] = await Promise.all([
      this.userRepository.update(id, {
        is_verified: true,
      }),
      this.mailService.sendMail({
        mailOptions: {
          subject: "User Profile Approved",
          to: user.email,
          html: successfulReviewEmailTemplate(),
        },
      }),
      this.notificationService.sendAdminNotification({
        fcmTokens: user.fcm_token?.map((user) => user.token),
        message:
          "Your profile has been approved, please check your email for confirmation",
      }),
    ]);

    if (!approval.affected) {
      throwHttpException(
        ["User approval failed"],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: "User approved successfully",
      approvedUser: user,
    };
  }
}
