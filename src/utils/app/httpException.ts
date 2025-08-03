import { HttpException, HttpStatus } from "@nestjs/common";
import { HttpStatusCode } from "axios";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";
export const throwHttpException = (
  messages: ErrorMessages[] | string[],
  status: HttpStatusCode,
  errorType: HttpStatus
): void => {
  const response = {
    message: messages,
    error: errorType,
    statusCode: status,
  };
  throw new HttpException({ ...response }, status);
};
