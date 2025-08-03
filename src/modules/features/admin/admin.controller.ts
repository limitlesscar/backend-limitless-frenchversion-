import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { GetDbUsersDTO } from "./dto/get-db-users.dto";
import { AdminLoginDTO } from "./dto/login.dto";
import { AuthorizationHeader } from "src/types/common.type";
import { HttpStatusCode } from "axios";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
import { throwHttpException } from "src/utils/app/httpException";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { JwtAdminGuard } from "src/modules/core/auth/guards/admin.guard";
import { RejectUserDto } from "./dto/reject-user.dto";

@Controller("admin")
@ApiTags("Admin-Panel")
export class AdminController {  
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}



  @Post("/login")
  async login(@Body() loginDto: AdminLoginDTO) {
    return this.adminService.login(loginDto);
  }














  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("users")
  async AllUsers(@Query() getDbUsersDTO: GetDbUsersDTO) {
    return this.adminService.UsersFromDb(getDbUsersDTO);
  }
  @ApiOperation({ summary: "Get user by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User Retrieved Successfully",
    type: UserEntity,
  })
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Get("user/:id")
  async getUserById(@Param("id") id: number): Promise<Partial<UserEntity>> {
    const user = await this.userService.getUserFromDB({
      where: { id },
      relations: { host: true },
    });
    if (!user) {
      throwHttpException(
        [ErrorMessages.USER_NOT_FOUND],
        HttpStatusCode.NotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    delete user.password;
    return user;
  }
  @ApiOperation({ summary: "Reject user" })
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Post("reject-user")
  async rejectUser(@Body() rejectUserDto: RejectUserDto) {
    return await this.adminService.rejectUser(rejectUserDto);
  }
  @ApiOperation({ summary: "Approve User" })
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @Post("approve-user/:id")
  async approveUser(@Param("id", ParseIntPipe) id: number) {
    return await this.adminService.approveUser(id);
  }
}
