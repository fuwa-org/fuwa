export declare class BitField {
    static FLAGS: Record<string, number>;
    bitfield: number;
    constructor(bitfield: number);
    remove(bit: number): number;
    add(bit: number): number;
    toString(): string;
    toArray(): string[];
}
