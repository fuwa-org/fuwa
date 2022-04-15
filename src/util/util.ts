export interface CreateEntityOptions {
  reason?: string;
  cache?: boolean;
}

export type ArgumentType<T> = T extends (...args: infer A) => any ? A : never;
export type FirstArrayValue<T> = T extends [infer U, ...any[]] ? U : never;

export function omit(obj: any, keys: string[]) {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
