export interface CreateEntityOptions {
    reason?: string;
    cache?: boolean;
}
export type ArgumentType<T> = T extends (...args: infer A) => any ? A : never;
export type FirstArrayValue<T> = T extends [infer U, ...any[]] ? U : never;
export type Null<T, Exceptions = never> = {
    [P in keyof T]: Exceptions extends P ? T[P] : NonNullable<T[P]> | null;
};
export type SnakeToCamel<T extends string | symbol | number> = T extends `${infer U}_${infer V}` ? `${U}${Capitalize<SnakeToCamel<V>>}` : T;
type SplitChars<T extends string | symbol | number> = T extends `${infer Head}${infer Tail}` ? [Head, ...SplitChars<Tail>] : [];
type JoinChars<T extends ReadonlyArray<string>> = T extends [] ? '' : T extends [infer Head, ...infer Tail] ? Head extends string ? Tail extends string[] ? `${Head}${JoinChars<Tail>}` : '' : '' : '';
type UpperChars = SplitChars<'ABCDEFGHIJKLMNOPQRSTUVWXYZ'>[number];
type PrefixAndLowercaseCapital<T extends string> = T extends UpperChars ? `_${Lowercase<T>}` : T;
type PrefixAndLowercaseCapitals<T extends string[]> = {
    [Index in keyof T]: T[Index] extends string ? PrefixAndLowercaseCapital<T[Index]> : T[Index];
};
export type CamelToSnake<T extends string | symbol | number> = JoinChars<PrefixAndLowercaseCapitals<SplitChars<T>>>;
export type CamelCase<T> = T extends Record<string, any> ? {
    [P in SnakeToCamel<keyof T>]: CamelCase<T[CamelToSnake<P>]>;
} : T;
export type SnakeCase<T> = T extends Record<string, any> ? {
    [P in CamelToSnake<keyof T>]: SnakeCase<T[SnakeToCamel<P>]>;
} : T;
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export declare function omit(obj: any, keys: string[]): any;
export {};
