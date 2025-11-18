import { DomainEvent } from '@/core/domain/base-classes/domain-event';
import { User } from '@/features/user/domain/entities/user';

export class SampleEvent extends DomainEvent<User> {
  constructor(user: User, options: { correlationId?: string; version?: number } = {}) {
    super('SampleEvent', user, options);
  }
}
