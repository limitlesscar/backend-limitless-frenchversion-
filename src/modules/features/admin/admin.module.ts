import { Module, OnModuleInit } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAdminService } from "src/modules/core/jwt/services/jwt-admin.service";
import { AdminRepository } from "./repositories/admin.repository";
import { AdminEntity } from "./entities/admin.entity";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { NotificationModule } from "../notification/notification.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    UserModule,
    NotificationModule,
  ],
  providers: [AdminService, AdminRepository, JwtAdminService, JwtService],
  controllers: [AdminController],
})
export class AdminModule {}

// Module: decorator that declares a class as a NestJS module
// OnModuleInit: optional interface to execute code when the module is initialized
// AdminService: service containing the business logic related to administrators
// AdminController: handles HTTP routes related to administrators
// TypeOrmModule: enables the registration of entities so Nest can inject repositories
// TypeOrmModule.forFeature([AdminEntity]): makes the Admin entity injectable within this module
// JwtAdminService: custom service for managing JWTs specifically for administrators
// AdminRepository: custom repository for complex queries related to administrators
// AdminEntity: entity representing an administrator in the database
// JwtService: provided by @nestjs/jwt to create and verify JWT tokens
// UserModule: user module (possibly used for relationships or validation)
// NotificationModule: used to notify administrators (e.g. via email, push notifications, etc.)
// AdminModule: main module for everything related to administrators (routes, services, entities, etc.)
