export abstract class Entity<T, U> {
  protected readonly _id: T;
  protected props: U;

  constructor(id: T, props: U) {
    this._id = id;
    this.props = props;
  }

  public get id(): T {
    return this._id;
  }

  // public abstract toPlainObject(): { id: string } & unknown;
}
