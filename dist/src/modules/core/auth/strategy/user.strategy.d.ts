import { ConfigService } from "@nestjs/config";
import { UserEntity } from "src/modules/features/user/entities/user.entity";
import { UserService } from "src/modules/features/user/user.service";
import { JWT } from "src/types/common.type";
declare const JwtUserStrategy_base: any;
export declare class JwtUserStrategy extends JwtUserStrategy_base {
    private readonly userService;
    constructor(configService: ConfigService, userService: UserService);
    validate({ id }: JWT): Promise<UserEntity | null>;
}
export {};
