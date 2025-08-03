import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JWT } from "src/types/common.type";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "src/modules/features/user/entities/user.entity";

@Injectable()
export class JwtUserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  generateAuthToken({ payload }: { payload: JWT }): string {
    const jwt = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>("app.userSecret"),
      expiresIn: this.configService.getOrThrow<number>("app.userExpiresIn"),
    });
    return jwt;
  }

  async decodeAuthToken({ token }: { token: string }): Promise<JWT> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("app.userSecret"),
      });
    } catch (error) {
      Logger.error("🚀 Decode Auth Token Error", error);
      throw new UnauthorizedException("Invalid token");
    }
  }
  // ======================================================= GENERATE JWT =======================================================
  /**
   * @description This method generates a JSON Web Token (JWT) for a given user entity based on their role.
   *
   * @param {UserEntity} user - The user entity for which the JWT should be generated.
   *
   * @returns {string} - Returns the generated JWT.
   *
   * @throws {Error} - If an error occurs during the JWT generation process.
   *
   * @example
   * const token = await userRepository.generateJWT(user);
   * Logger.log(token);
   */
  generateJWT(user: UserEntity): string | null {
    const payload: JWT = {
      id: user.id,
      email: user.email,
    };

    Logger.log(
      "[User Auth Service][generateJWT]: ",
      this.generateAuthToken({ payload })
    );

    return this.generateAuthToken({ payload });
  }
}
