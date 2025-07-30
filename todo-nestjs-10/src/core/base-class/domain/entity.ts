export abstract class Entity<T, U> {
  protected readonly _id: T;
  protected readonly props: U;

  constructor(id: T, props: U) {
    this._id = id;
    this.props = Object.freeze(props);
  }

  public get id(): T {
    return this._id;
  }

  public toPlainObject(): unknown {
    return {
      id: this._id,
      ...this.props,
    };
  }
}
