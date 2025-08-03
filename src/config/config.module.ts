// NestJS Common Imports
import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

// Loaders
import appConfig from "./loaders/app.config";
import smtpConfig from "./loaders/smtp.config";

// Validation
import { validationSchema } from "./schema";

@Module({
  imports: [
    NestConfigModule.forRoot({
      ignoreEnvFile: false,
      load: [appConfig, smtpConfig],
      validate: validationSchema.parse,
      envFilePath: ".env",
      isGlobal: true,
    }),
  ],
})
export class CustomConfigModule {}

// This module configures global environment variables for the app using NestJS ConfigModule.
// It loads custom app and SMTP configurations from separate loader files,
// applies validation on the environment variables using a Zod schema,
// and ensures the configuration is available globally across the application.
