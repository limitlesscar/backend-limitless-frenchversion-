// Nest.JS Imports
import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  timezone: process.env.TZ,
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 8001,
  userSecret: process.env.USER_SECRET_KEY,
  userExpiresIn: process.env.USER_EXPIRES_IN,
  adminSecret: process.env.ADMIN_SECRET_KEY,
  adminExpiresIn: process.env.ADMIN_EXPIRES_IN,
  otpExpiry: process.env.OTP_EXPIRES_IN,
  otpSecret: process.env.OTP_SECRET_KEY,
}));


// This file defines a namespaced configuration ("app") using NestJS's registerAs helper.
// It maps environment variables related to app settings (timezone, environment, port, secrets, expiry times)
// into a single configuration object accessible throughout the application.
