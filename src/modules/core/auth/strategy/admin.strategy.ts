// NestJS Common Imports
import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";

// NestJS Config Service Import
import { ConfigService } from "@nestjs/config";

// NestJS Passport Imports
import { PassportStrategy } from "@nestjs/passport";
import { HttpStatusCode } from "axios";

// Passport JWT Imports
import { ExtractJwt, Strategy } from "passport-jwt";
import { AdminService } from "src/modules/features/admin/admin.service";
import { AdminEntity } from "src/modules/features/admin/entities/admin.entity";
import { AdminRepository } from "src/modules/features/admin/repositories/admin.repository";

// Entity Imports
import { UserEntity } from "src/modules/features/user/entities/user.entity";

// Service Imports
import { UserService } from "src/modules/features/user/user.service";

// JWT Types Import
import { JWT } from "src/types/common.type";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { throwHttpException } from "src/utils/app/httpException";

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, "jwt_admin") {
  constructor(
    configService: ConfigService,
    private readonly adminRepository: AdminRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow("app.adminSecret"),
      ignoreExpiration: false,
    });
  }

  async validate({ id }: JWT): Promise<AdminEntity | null> {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id },
      });

      if (!admin) {
        Logger.error("Invalid token");
        throwHttpException(
          [ErrorMessages.INVALID_TOKEN],
          HttpStatusCode.Unauthorized,
          HttpStatus.UNAUTHORIZED,
        );
      }
      delete admin.password;
      return admin;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        Logger.error("Token expired");
        throwHttpException(
          [ErrorMessages.EXPIRED_TOKEN],
          HttpStatusCode.Unauthorized,
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throwHttpException(
          ["Unauthorized"],
          HttpStatusCode.Unauthorized,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
