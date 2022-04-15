export interface CreateEntityOptions {
    reason?: string;
    cache?: boolean;
}
export declare type ArgumentType<T> = T extends (...args: infer A) => any ? A : never;
export declare type FirstArrayValue<T> = T extends [infer U, ...any[]] ? U : never;
export declare function omit(obj: any, keys: string[]): any;
