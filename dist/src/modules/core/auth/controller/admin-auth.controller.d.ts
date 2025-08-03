import { HttpStatus } from "@nestjs/common";
import { AuthService } from "../service/user-auth.service";
import { UserEntity } from "src/modules/features/user/entities/user.entity";
import { AdminLoginDTO } from "../dto/admin-login.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login({ email, password }: AdminLoginDTO): Promise<{
        user: UserEntity;
        token: string;
    } | {
        message: string;
        status: HttpStatus;
    }>;
}
