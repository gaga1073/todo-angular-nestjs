import { BadRequestException } from '@nestjs/common';
import { ValueObject } from '@/core/base-class/domain/value-object';

export class Email extends ValueObject<string, 'email'> {
  protected validate(value: string): void {
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email#basic_validation
     */
    const regex =
      /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;
    if (regex.test(value)) {
      throw new BadRequestException(`Invalid UserId format`);
    }
  }
}
