import { Injectable } from "@nestjs/common";
@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
}

// This is a simple service class in a NestJS application.
// The `@Injectable()` decorator marks the class as a provider that can be injected into other components (e.g., controllers).
// The `getHello()` method returns a static "Hello World!" string, typically used as a placeholder or initial test response.
