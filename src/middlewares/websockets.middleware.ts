import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Socket } from "socket.io";
import { WsJwtGuard } from "src/modules/core/auth/guards/ws.guard";
@Injectable()
export class SocketAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async use(client: Socket, next: (err?: Error) => void): Promise<void> {
    try {
      // Create an instance of WsJwtGuard using the injected services
      const wsJwtGuard = new WsJwtGuard(this.jwtService, this.configService);
      // Validate the token
      const payload = await wsJwtGuard.validateToken(client);
      client.data.userId = payload?.id;
      next();
    } catch (err) {
      next(err);
    }
  }
}

// Middleware for authenticating Socket.IO connections using JWT tokens.
// It uses a WebSocket JWT guard (`WsJwtGuard`) to validate the client's token,
// and attaches the decoded user ID to the socket's data for downstream use.
// If token validation fails, the connection is rejected with an error.
