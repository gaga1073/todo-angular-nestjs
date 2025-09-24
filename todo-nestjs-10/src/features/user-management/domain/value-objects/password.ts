import { BadRequestException } from '@nestjs/common';
import { ValueObject } from '@/core/base-class/domain/value-object';

export class Password extends ValueObject<string, 'password'> {
  protected validate(value: string): void {
    const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z1-9])^[\w]{8,16}$/;

    if (regex.test(value)) {
      throw new BadRequestException('');
    }
  }
}
