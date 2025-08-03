// NestJS Common Imports
import { HttpStatus, Injectable, Logger } from "@nestjs/common";
// NestJS Config Service Import
import { ConfigService } from "@nestjs/config";
// NestJS Passport Imports
import { PassportStrategy } from "@nestjs/passport";
import { HttpStatusCode } from "axios";
// Passport JWT Imports
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "src/modules/features/user/entities/user.entity";
// Service Imports
import { UserService } from "src/modules/features/user/user.service";
// JWT Types Import
import { JWT } from "src/types/common.type";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { throwHttpException } from "src/utils/app/httpException";

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, "jwt_user") {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("app.userSecret"),
      ignoreExpiration: false,
    });
  }

  async validate({ id }: JWT): Promise<UserEntity | null> {
    try {
      const user = await this.userService.getUserFromDB({
        where: { id },
        relations: { host: true },
      });

      if (!user) {
        Logger.error("Invalid token");
        throwHttpException(
          [ErrorMessages.INVALID_TOKEN],
          HttpStatusCode.Unauthorized,
          HttpStatus.UNAUTHORIZED,
        );
      }
      delete user.password;
      return user;
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
