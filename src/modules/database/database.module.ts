import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as fs from "fs";
import { join } from "path";
import { CarEntity } from "../features/car/entities/car.entity";
// import { QueryLogger } from "./query-logger";
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.getOrThrow("POSTGRES_HOST"),
        port: configService.getOrThrow("POSTGRES_PORT"),
        username: configService.getOrThrow("POSTGRES_USER"),
        password: configService.getOrThrow("POSTGRES_PASSWORD"),
        database: configService.getOrThrow("POSTGRES_DATABASE"),
        synchronize: false,
        ssl: {
          rejectUnauthorized: true, // Enforces verification of the server's SSL certificate
          ca: fs
            .readFileSync(
              join(
                process.cwd(),
                "src/modules",
                "database",
                "eu-north-1-bundle.pem"
              )
            )
            .toString(),
        },
        autoLoadEntities: true,
        // logger: new QueryLogger(),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
