import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsYearMonthDayFormatConstraint
  implements ValidatorConstraintInterface
{
  validate(date: string): boolean {
    // Check if the date is in the YYYY-MM-DD format using regex
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }
  defaultMessage(args: ValidationArguments): string {
    return `Date (${args.value}) must be in the format YYYY-MM-DD`;
  }
}

export function IsYearMonthDayFormat(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsYearMonthDayFormatConstraint,
    });
  };
}


// Custom class-validator decorator to validate that a string matches the "YYYY-MM-DD" date format.
// Uses a regex to ensure the date format is correct and provides a custom error message if validation fails.
// This decorator can be applied to class properties to enforce date format validation in DTOs or entities.
