export class BitField {
  static FLAGS: Record<string, number> = {}; // this is for the derived classes
  bitfield: number;
  constructor(bitfield: number) {
    this.bitfield = bitfield;
  }
  remove(bit: number): number {
    return (this.bitfield -= bit);
  }
  add(bit: number): number {
    return (this.bitfield += bit);
  }
  toString(): string {
    return this.bitfield.toString();
  }
  toArray(): string[] {
    return Object.entries((this.constructor as typeof BitField).FLAGS)
      .filter(([, bit]) => (this.bitfield & bit) === bit)
      .map(([K]) => K);
  }
}
