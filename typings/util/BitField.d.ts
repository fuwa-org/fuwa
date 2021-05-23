export declare class BitField {
    static FLAGS: Record<string, number>;
    bitfield: number;
    constructor(bitfield: number);
    add(bit: number): number;
remove(bit: number): number;
    
    toArray(): string[];
toString(): string;
    
}
