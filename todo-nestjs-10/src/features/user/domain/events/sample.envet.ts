import { User } from '@/features/user/domain/entities/user';
import { DomainEvent } from '@/shared/base-class/domain/domain-event';

export class SampleEvent extends DomainEvent<User> {
  constructor(user: User, options: { correlationId?: string; version?: number } = {}) {
    super('SampleEvent', user, options);
  }
}
