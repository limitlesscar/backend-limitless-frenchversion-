import { AdminRepository } from "./repositories/admin.repository";
import { JwtAdminService } from "src/modules/core/jwt/services/jwt-admin.service";
import { GetDbUsersDTO } from "./dto/get-db-users.dto";
import { UserRepository } from "../user/repositories/user.repository";
import { AdminLoginDTO } from "./dto/login.dto";
import { RejectUserDto } from "./dto/reject-user.dto";
import { UserEntity } from "../user/entities/user.entity";
import { MailService } from "src/modules/core/mail/mail.service";
import { NotificationService } from "../notification/notification.service";
export declare class AdminService {
    private readonly adminRepository;
    private readonly jwtAdminService;
    private readonly userRepository;
    private readonly mailService;
    private readonly notificationService;
    constructor(adminRepository: AdminRepository, jwtAdminService: JwtAdminService, userRepository: UserRepository, mailService: MailService, notificationService: NotificationService);
    createAdmin(data: {
        email: string;
        password: string;
    }): Promise<any>;
    login({ email, password }: AdminLoginDTO): Promise<{
        message: string;
        token: string;
    }>;
    UsersFromDb({ role, page, limit, search, status }: GetDbUsersDTO): Promise<{
        data: any;
        total: any;
        totalPages: number;
        currentPage: number;
        nextPage: number;
        previousPage: number;
    }>;
    rejectUser({ id, rejection_reason, }: RejectUserDto): Promise<{
        message: string;
        rejectedUser: UserEntity;
    }>;
    approveUser(id: number): Promise<{
        message: string;
        approvedUser: UserEntity;
    }>;
}
