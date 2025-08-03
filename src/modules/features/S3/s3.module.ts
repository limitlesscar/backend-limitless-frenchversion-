import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/modules/features/user/user.module";

@Module({
  imports: [S3Module, ConfigModule, UserModule],
  controllers: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
