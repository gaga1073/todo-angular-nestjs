import { BadRequestException } from '@nestjs/common';
import { ulid } from 'ulid';
import { ValueObject } from '@/core/base-class/domain/value-object';

export class Ulid extends ValueObject<string, 'ulid'> {
  constructor(protected readonly _value = ulid()) {
    super(_value);
  }

  protected validate(value: string): void {
    const regex = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
    if (!regex.test(value)) {
      throw new BadRequestException(`Invalid UserId format: ${value}`);
    }
  }

  public toString(): string {
    return this._value;
  }
}
