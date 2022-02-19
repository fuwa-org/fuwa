export declare class Bitfield {
    bits: number;
    static FLAGS: Record<string, number>;
    constructor(bits: number);
    add(bit: number): number;
    has(bit: number): boolean;
    remove(bit: number): number;
    toString(): string;
}
