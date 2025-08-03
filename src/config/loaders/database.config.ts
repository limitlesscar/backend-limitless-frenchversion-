import { registerAs } from "@nestjs/config";

export default registerAs("postgres", () => ({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: process.env.POSTGRES_SSL,
}));


// This file defines a namespaced configuration ("postgres") using NestJS's registerAs helper.
// It maps PostgreSQL-related environment variables (host, port, user, password, database, SSL)
// into a configuration object to be used for database connection settings throughout the app.
