import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
export declare class IsYearMonthDayFormatConstraint implements ValidatorConstraintInterface {
    validate(date: string): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsYearMonthDayFormat(validationOptions?: ValidationOptions): (object: unknown, propertyName: string) => void;
