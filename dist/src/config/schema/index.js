"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const z_1 = require("nestjs-zod/z");
exports.validationSchema = z_1.z.object({
    TZ: z_1.z.string().default("UTC"),
    NODE_ENV: z_1.z.string().default("development"),
    PORT: z_1.z.coerce.number().default(4000),
    POSTGRES_HOST: z_1.z.string().default("localhost"),
    POSTGRES_PORT: z_1.z.coerce.number().default(5432),
    POSTGRES_USER: z_1.z.string(),
    POSTGRES_PASSWORD: z_1.z.string(),
    POSTGRES_DATABASE: z_1.z.string(),
    POSTGRES_SSL: z_1.z.string(),
    USER_SECRET_KEY: z_1.z.string().default("user_secret"),
    USER_EXPIRES_IN: z_1.z.string().default("1d"),
    ADMIN_SECRET_KEY: z_1.z.string().default("admin_secret"),
    ADMIN_EXPIRES_IN: z_1.z.string().default("1d"),
    OTP_SECRET_KEY: z_1.z.string().default("otp_secret"),
    OTP_EXPIRES_IN: z_1.z.string().default("1d"),
    SMTP_EMAIL: z_1.z.string(),
    SMTP_PASSWORD: z_1.z.string(),
    AWS_BUCKET_NAME: z_1.z.string(),
    AWS_REGION: z_1.z.string(),
    AWS_ACCESS_KEY_ID: z_1.z.string(),
    AWS_SECRET_ACCESS_KEY: z_1.z.string(),
    GOOGLE_MAPS_API_KEY: z_1.z.string(),
    STRIPE_TEST_KEY: z_1.z.string(),
    STRIPE_TEST_WEBHOOK_SECRET: z_1.z.string().optional(),
    STRIPE_CONNECT_WEBHOOK_SECRET: z_1.z.string().optional(),
    STRIPE_PUBLISH_KEY: z_1.z.string(),
});
//# sourceMappingURL=index.js.map