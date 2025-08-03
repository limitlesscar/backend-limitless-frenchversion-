import { ValidationArguments } from "class-validator";
export declare const alphabeticError: ({ property }: ValidationArguments) => string;
export declare const alphanumericError: ({ property }: ValidationArguments) => string;
export declare const numericError: ({ property }: ValidationArguments) => string;
