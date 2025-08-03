import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { HttpStatusCode } from "axios";
import { Socket } from "socket.io";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { throwHttpException } from "src/utils/app/httpException";

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    if (context.getType() !== "ws") {
      true;
    }

    const client: Socket = context.switchToWs().getClient();
    const { authorization } = client.handshake.headers; // for postman  //if real world client.handshake.auth

    this.validateToken(client);

    return false;
  }

  async validateToken(client: Socket): Promise<any> {
    const { authorization } = client.handshake.headers;

    if (!authorization) {
      throwHttpException(
        [ErrorMessages.UNAUTHORIZED_ACCESS],
        HttpStatusCode.Unauthorized,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authorization.split(" ")[1];

    const payload = await this.jwtService.decode(token);

    return payload;
  }
}
