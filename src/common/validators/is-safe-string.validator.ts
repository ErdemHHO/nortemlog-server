import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  ERROR_MESSAGES,
  SAFE_STRING_VALIDATOR_NAME,
} from '../constants/error.constants.js';

const DANGEROUS_PATTERNS: readonly RegExp[] = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|DECLARE|CAST|CHR)\b\s+)/i,
  /(\b(OR|AND)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
  /(--|\/\*|\*\/|;)/,
  /(\bxp_\w+\b)/i,
  /(<\s*\/?\s*script\b|javascript\s*:|on\w+\s*=)/i,
];

@ValidatorConstraint({ name: SAFE_STRING_VALIDATOR_NAME, async: false })
export class IsSafeStringConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    return !DANGEROUS_PATTERNS.some((pattern) => pattern.test(value));
  }

  defaultMessage(args: ValidationArguments): string {
    return ERROR_MESSAGES.UNSAFE_STRING.replace('$property', args.property);
  }
}

export function IsSafeString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol): void {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyName),
      options: validationOptions,
      constraints: [],
      validator: IsSafeStringConstraint,
    });
  };
}
