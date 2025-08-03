import { registerAs } from "@nestjs/config";
export default registerAs("smtp", () => ({
  email: process.env.SMTP_EMAIL,
  password: process.env.SMTP_PASSWORD,
}));
// This file defines a namespaced configuration ("smtp") using NestJS's registerAs helper.
// It maps SMTP email and password environment variables for configuring mail sending services.
