export class Util {
  constructor() {
    throw new TypeError(
      `The ${this.constructor.name} class may not be instantiated.`
    );
  }
  static sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
  static noop() {}
  static getURLBucket(url: string) {
    return url.replace(/\d+/g, ":id"); // t
  }
}
