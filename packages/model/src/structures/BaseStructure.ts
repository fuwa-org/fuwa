export abstract class BaseStructure<T> {
  constructor(public _data?: T) {
    Object.defineProperty(this, '_data', {
      enumerable: false,
    });
  }
  abstract toJSON(): T;

  public static toJSON(data: any): any {
    if (data.toJSON && typeof data.toJSON === 'function') return data.toJSON();
    else return {};
  }
}
