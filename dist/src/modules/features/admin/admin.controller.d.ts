import { AdminService } from "./admin.service";
import { GetDbUsersDTO } from "./dto/get-db-users.dto";
import { AdminLoginDTO } from "./dto/login.dto";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { RejectUserDto } from "./dto/reject-user.dto";
export declare class AdminController {
    private readonly adminService;
    private readonly userService;
    constructor(adminService: AdminService, userService: UserService);
    login(loginDto: AdminLoginDTO): Promise<{
        message: string;
        token: string;
    }>;
    AllUsers(getDbUsersDTO: GetDbUsersDTO): Promise<{
        data: any;
        total: any;
        totalPages: number;
        currentPage: number;
        nextPage: number;
        previousPage: number;
    }>;
    getUserById(id: number): Promise<Partial<UserEntity>>;
    rejectUser(rejectUserDto: RejectUserDto): Promise<{
        message: string;
        rejectedUser: UserEntity;
    }>;
    approveUser(id: number): Promise<{
        message: string;
        approvedUser: UserEntity;
    }>;
}
