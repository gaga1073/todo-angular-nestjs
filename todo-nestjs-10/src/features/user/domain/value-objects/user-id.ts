import { ValueObject } from 'src/core/base-class/domain/value-object';
import { ulid } from 'ulid';

export class UserId extends ValueObject<string, 'UserId'> {
  constructor(protected readonly _value = ulid()) {
    super(_value);
  }

  protected validate(value: string): void {
    const ULID_REGEX = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
    if (!ULID_REGEX.test(value)) {
      throw new Error(`Invalid UserId format: ${value}`);
    }
  }

  public toString(): string {
    return this._value;
  }
}
