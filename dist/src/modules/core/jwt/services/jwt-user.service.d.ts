import { JWT } from "src/types/common.type";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "src/modules/features/user/entities/user.entity";
export declare class JwtUserService {
    private readonly configService;
    private readonly jwtService;
    constructor(configService: ConfigService, jwtService: JwtService);
    generateAuthToken({ payload }: {
        payload: JWT;
    }): string;
    decodeAuthToken({ token }: {
        token: string;
    }): Promise<JWT>;
    generateJWT(user: UserEntity): string | null;
}
