export declare abstract class Bitfield {
    bits: number;
    static Bits: any;
    constructor(bits: number);
    add(bit: number): number;
    has(bit: number): boolean;
    remove(bit: number): number;
    toString(): string;
    toArray(): string[];
    toJSON(): number[];
}
