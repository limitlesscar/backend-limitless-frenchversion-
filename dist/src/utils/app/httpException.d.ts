import { HttpStatus } from "@nestjs/common";
import { HttpStatusCode } from "axios";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
export declare const throwHttpException: (messages: ErrorMessages[] | string[], status: HttpStatusCode, errorType: HttpStatus) => void;
