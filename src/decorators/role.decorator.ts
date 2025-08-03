import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { USER_TYPE_ENUM } from "src/modules/features/user/enums/user-role.enum";
export const ROLES_KEY = "roles";
export const Roles = (...roles: USER_TYPE_ENUM[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
// This file defines a custom NestJS decorator `Roles` to assign role-based metadata to route handlers.
// It uses `SetMetadata` to attach an array of allowed user roles (from USER_TYPE_ENUM) to the route,
// which can later be used by guards to enforce role-based access control.
