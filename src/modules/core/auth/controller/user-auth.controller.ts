// Nest JS
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
// Services
import { AuthService } from "../service/user-auth.service";
// Response and DTO
import { UserLogin } from "../response";
import { LoginDTO } from "../dto/login.dto";
import { ForgotPasswordDTO } from "../dto/forgot-password.dto";
import { RequestOTPDTO } from "../dto/request-otp.dto";
import { RegisterDTO } from "../dto/register.dto";
// Entities
import { UserEntity } from "src/modules/features/user/entities/user.entity";
// Utils
import { errorSchema } from "src/utils/app/error-schema";
import { VerifyOtpDTO } from "../dto/verify-otp.dto";
@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // ========================================== Login ==========================================
  @ApiOperation({ summary: "Connexion d'un utilisateur" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "L'utilisateur s'est connecté avec succès.",
    type: UserLogin,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Échec de la validation.",
    schema: errorSchema(HttpStatus.BAD_REQUEST),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "OTP invalide.",
    schema: errorSchema(HttpStatus.UNAUTHORIZED),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Utilisateur non trouvé.",
    schema: errorSchema(HttpStatus.NOT_FOUND),
  })
  @ApiBody({ type: LoginDTO })
  @Post("/login")
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() { email, password }: LoginDTO
  ): Promise<{ user: UserEntity; token: string }> {
    return await this.authService.login({ email, password });
  }

  // ========================================== Request OTP for Forgot Password==========================================
  @ApiOperation({
    summary: "Demande de code OTP pour mot de passe oublié",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Le code OTP a été envoyé à votre adresse e-mail.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Échec de la validation.",
    schema: errorSchema(HttpStatus.BAD_REQUEST),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "OTP invalide.",
    schema: errorSchema(HttpStatus.UNAUTHORIZED),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Utilisateur non trouvé.",
    schema: errorSchema(HttpStatus.NOT_FOUND),
  })
  @ApiBody({ type: RequestOTPDTO })
  @Post("/request-otp")
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async requestOTP(
    @Body() { email, reason }: RequestOTPDTO
  ): Promise<{ message: string }> {
    return await this.authService.requestOTP({
      email,
      reason,
    });
  }
  // ========================================== Verify OTP code ==========================================
  @ApiOperation({ summary: "Vérifier le code OTP" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Le code OTP a été vérifié.",
  })
  @ApiBody({ type: VerifyOtpDTO })
  @Post("/verify-otp")
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() { email, otp, reason }: VerifyOtpDTO
  ): Promise<{ user: UserEntity; token: string; message: string }> {
    return await this.authService.verifyOtp({
      email,
      otp,
      reason,
    });
  }
  // ========================================== Reset Password ==========================================
  @ApiOperation({ summary: "Réinitialiser le mot de passe" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Le mot de passe a été réinitialisé avec succès.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Échec de la validation.",
    schema: errorSchema(HttpStatus.BAD_REQUEST),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "OTP invalide.",
    schema: errorSchema(HttpStatus.UNAUTHORIZED),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Utilisateur non trouvé.",
    schema: errorSchema(HttpStatus.NOT_FOUND),
  })
  @ApiBody({ type: ForgotPasswordDTO })
  @Post("/reset-password")
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() { email, password, otp }: ForgotPasswordDTO
  ): Promise<{ message: string }> {
    return await this.authService.resetPassword({
      email,
      otp,
      password,
    });
  }
}
