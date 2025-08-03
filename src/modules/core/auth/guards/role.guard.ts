import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { HttpStatusCode } from "axios";
import { ROLES_KEY } from "src/decorators/role.decorator";
import { USER_TYPE_ENUM } from "src/modules/features/user/enums/user-role.enum";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { throwHttpException } from "src/utils/app/httpException";
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<USER_TYPE_ENUM[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles) {
      return true;
    }

    const userRole: USER_TYPE_ENUM[] = request.user?.user_type;
    if (userRole && requiredRoles.some((role) => userRole.includes(role))) {
      return true;
    }

    throwHttpException(
      [ErrorMessages.UNAUTHORIZED_ACCESS],
      HttpStatusCode.Forbidden,
      HttpStatus.FORBIDDEN,
    );
  }
}
