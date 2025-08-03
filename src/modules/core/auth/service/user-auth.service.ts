// Nest JS
import { HttpStatus, Injectable, Logger } from "@nestjs/common";
// entity imports
import { UserEntity } from "src/modules/features/user/entities/user.entity";
// service imports
import { OtpService } from "src/modules/features/otp/otp.service";
import { UserService } from "src/modules/features/user/user.service";
import { JwtUserService } from "../../jwt/services/jwt-user.service";
// ENUMS, TYPES, INTERFACES and DTO imports
import { JWT } from "src/types/common.type";
// uncomment this when you want to use enums
// import { USER_ROLE_ENUM } from 'src/types/enums/user/user-role.enum';
// utils imports
import { throwHttpException } from "src/utils/app/httpException";
import { comparePassword, hashPassword } from "src/utils/hashing/bcrypt";
import { OTP_REASON_ENUM } from "src/modules/features/otp/enums/otp-reason.enum";
import { forgotPasswordOtpTemplate } from "../../mail/template/forget-password";
import { MailService } from "../../mail/mail.service";
import { HttpStatusCode } from "axios";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { NotificationService } from "src/modules/features/notification/notification.service";
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtUserService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
  ) {}
  // TODO: ADD function description
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ user: UserEntity; token: string }> {
    email = email.toLowerCase();
    const user = await this.userService.getUserFromDB({
      where: { email },
      relations: { host: true },
    });
    if (!user) {
      throwHttpException(
        [ErrorMessages.USER_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    const passwordMatched = comparePassword(password, user.password);
    if (!passwordMatched) {
      throwHttpException(
        [ErrorMessages.INVALID_CREDENTIALS],
        HttpStatusCode.Unauthorized,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.jwtService.generateJWT(user);
    delete user.password;
    return { user, token };
  }
  // ======================================================= Request OTP =======================================================
  /**
   * @description This method is used to generate an OTP (One-Time Password) code and sends it to the user's email address.
   *
   * @param {Object} options - An object containing the necessary parameters for the password reset process.
   * @param {string} options.email - The email address of the user who has forgotten their password.
   * @param {OTP_REASON_ENUM} options.reason - The reason for requesting the OTP code.
   *
   * @returns {Promise<{ message: string }>} - Returns a Promise that resolves to an object containing a success message.
   *
   * @throws {UnauthorizedException} - If the user with the provided email address is not found.
   * @throws {Error} - If an error occurs during the OTP generation or email sending process.
   *
   * @example
   * const response = await userRepository.forgotPassword({ email: 'user@example.com' });
   * Logger.log(response.message);
   */
  async requestOTP({
    email,
    reason,
  }: {
    email: string;
    reason: OTP_REASON_ENUM;
  }): Promise<{ message: string }> {
    const user = await this.userService.getUserFromDB({ where: { email } });

    if (!user) {
      throwHttpException(
        [ErrorMessages.USER_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    if (reason !== OTP_REASON_ENUM.FORGOT_PASSWORD) {
      throwHttpException(
        [ErrorMessages.INVALID_OTP_REASON],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const code = await this.otpService.generateOTPCode({
      email,
      reason,
    });
    const mailOptions = {
      to: email,
      subject: "Vérification OTP Go Limitless",
      html: forgotPasswordOtpTemplate(code),
    };

    await this.mailService.sendMail({ mailOptions: mailOptions });

    return {
      message: "Le code OTP a été envoyé à votre email",
    };
  }
  // ======================================================= Verify OTP =======================================================
  /**
   * @description This method is used to register a new user by onboarding them and generating a JSON Web Token (JWT) for authentication.
   *
   * @param {Object} options - An object containing the necessary parameters for registering the user.
   * @param {string} options.email - The email address of the user.
   * @param {string} options.password - The password of the user.
   * @param {string} options.date_of_birth - The date of birth of the user.
   *
   * @returns {Promise<{ user: UserEntity; token: string; message: string }>} - Returns a Promise that resolves to an object containing the registered user entity, the generated JWT, and a success message.
   *
   * @throws {HttpException} - If the user is not found, already onboarded, or cannot be onboarded due to their current status.
   * @throws {Error} - If an error occurs during the onboarding or JWT generation process.
   *
   * @example
   * const response = await userRepository.register({
   *   email: 'user@example.com',
   *   password: 'password123',
   *   date_of_birth: '1990-01-01',
   * });
   * Logger.log(response.user, response.token, response.message);
   */

  async verifyOtp({
    email,
    otp,
    reason,
  }: {
    email: string;
    otp: number;
    reason: OTP_REASON_ENUM;
  }): Promise<{ user: UserEntity; token: string; message: string }> {
    const user = await this.userService.getUserFromDB({ where: { email } });

    if (!user) {
      throwHttpException(
        [ErrorMessages.USER_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    const { statusCode } = await this.otpService.verifyOTPCode({
      otp,
      email,
      reason,
    });

    if (
      reason === OTP_REASON_ENUM.FORGOT_PASSWORD &&
      statusCode === HttpStatusCode.Ok
    ) {
      const token = this.jwtService.generateJWT({
        id: user.id,
        email: user.email,
      } as Partial<UserEntity> as UserEntity);

      return {
        user,
        token,
        //message: "OTP has been verified.",
        message: "Le code OTP a été vérifié.",

      };
    }
  }

  // ======================================================= Reset Password =======================================================
  /**
   * @description This method is used to reset a user's password after verifying the provided OTP (One-Time Password) code.
   *
   * @param {Object} options - An object containing the necessary parameters for resetting the password.
   * @param {string} options.email - The email address of the user resetting their password.
   * @param {string} options.otp - The OTP code entered by the user.
   * @param {string} options.password - The new password chosen by the user.
   *
   * @returns {Promise<{ message: string }>} - Returns a Promise that resolves to an object containing a success message.
   *
   * @throws {UnauthorizedException} - If the user with the provided email address is not found.
   * @throws {HttpException} - If the provided OTP code is invalid or has expired.
   * @throws {Error} - If an error occurs during the password reset process.
   *
   * @example
   * const response = await userRepository.resetPassword({
   *   email: 'user@example.com',
   *   otp: '123456',
   *   password: 'newPassword123',
   * });
   * Logger.log(response.message);
   */
  async resetPassword({
    email,
    otp,
    password,
  }: {
    email: string;
    otp: number;
    password: string;
  }): Promise<{ message: string }> {
    const user = await this.userService.getUserFromDB({ where: { email } });

    if (!user) {
      throwHttpException(
        [ErrorMessages.USER_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    const isSamePassword = comparePassword(password, user.password);

    if (isSamePassword) {
      throwHttpException(
        [ErrorMessages.INVALID_PASSWORD],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { status } = await this.otpService.verifyOTPCode({
      email,
      otp,
      reason: OTP_REASON_ENUM.FORGOT_PASSWORD,
    });
    if (status !== HttpStatus.OK) {
      throwHttpException(
        [ErrorMessages.CANNOT_RESET_PASSWORD_AT_THIS_MOMENT],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = hashPassword(password);
    await this.userService.updateUser({
      where: { email },
      data: { password: hashedPassword },
    });

    return {
      message: "Le mot de passe a été réinitialisé avec succès.",
    };
  }
}
