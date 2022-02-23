import snakeCase from "lodash.snakecase";

export class DataTransformer {
  static snakeCase(data: any): any {
    if (typeof data !== "object") return data;

    return Object.fromEntries(Object.entries(data).map(([K, V]) => [snakeCase(K), DataTransformer.snakeCase(V)]))
  }
}

