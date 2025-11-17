import { AggregateRoot } from '@nestjs/cqrs';

export abstract class Entity<T, U> extends AggregateRoot {
  protected readonly _id: T;
  protected props: U;

  constructor(id: T, props: U) {
    super();
    this._id = id;
    this.props = props;
  }

  public get id(): T {
    return this._id;
  }

  // public abstract toPlainObject(): { id: string } & unknown;
}
