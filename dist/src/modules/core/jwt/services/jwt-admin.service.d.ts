import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JWT } from "src/types/common.type";
export declare class JwtAdminService {
    private readonly configService;
    private readonly jwtService;
    constructor(configService: ConfigService, jwtService: JwtService);
    generateAuthToken({ payload }: {
        payload: JWT;
    }): string;
    decodeAuthToken({ token }: {
        token: string;
    }): Promise<JWT>;
}
