import { CustomDecorator } from "@nestjs/common";
import { USER_TYPE_ENUM } from "src/modules/features/user/enums/user-role.enum";
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: USER_TYPE_ENUM[]) => CustomDecorator<string>;
