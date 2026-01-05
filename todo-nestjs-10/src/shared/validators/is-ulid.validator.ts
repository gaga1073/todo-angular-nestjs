import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

export class IsUlidConstrant implements ValidatorConstraintInterface {
  validate(value: string): Promise<boolean> | boolean {
    const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/i;

    if (typeof value !== 'string') {
      return false;
    }
    return ULID_REGEX.test(value);
  }

  defaultMessage(): string {
    return 'ULIDの形式に適合していません。';
  }
}

export function IsUlid(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'isUlid',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: IsUlidConstrant,
    });
  };
}
