export interface CreateEntityOptions {
    reason?: string;
    cache?: boolean;
}
export declare type ArgumentType<T> = T extends (...args: infer A) => any ? A : never;
export declare type FirstArrayValue<T> = T extends [infer U, ...any[]] ? U : never;
export declare type Null<T, Exceptions = never> = {
    [P in keyof T]: Exceptions extends P ? T[P] : NonNullable<T[P]> | null;
};
export declare type SnakeToCamel<T extends string | symbol | number> = T extends `${infer U}_${infer V}` ? `${U}${Capitalize<SnakeToCamel<V>>}` : T;
declare type SplitChars<T extends string | symbol | number> = T extends `${infer Head}${infer Tail}` ? [Head, ...SplitChars<Tail>] : [];
declare type JoinChars<T extends ReadonlyArray<string>> = T extends [] ? '' : T extends [infer Head, ...infer Tail] ? Head extends string ? Tail extends string[] ? `${Head}${JoinChars<Tail>}` : '' : '' : '';
declare type UpperChars = SplitChars<'ABCDEFGHIJKLMNOPQRSTUVWXYZ'>[number];
declare type PrefixAndLowercaseCapital<T extends string> = T extends UpperChars ? `_${Lowercase<T>}` : T;
declare type PrefixAndLowercaseCapitals<T extends string[]> = {
    [Index in keyof T]: T[Index] extends string ? PrefixAndLowercaseCapital<T[Index]> : T[Index];
};
export declare type CamelToSnake<T extends string | symbol | number> = JoinChars<PrefixAndLowercaseCapitals<SplitChars<T>>>;
export declare type CamelCase<T> = T extends Record<string, any> ? {
    [P in SnakeToCamel<keyof T>]: CamelCase<T[CamelToSnake<P>]>;
} : T;
export declare type SnakeCase<T> = T extends Record<string, any> ? {
    [P in CamelToSnake<keyof T>]: SnakeCase<T[SnakeToCamel<P>]>;
} : T;
export declare type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export declare function omit(obj: any, keys: string[]): any;
export {};
