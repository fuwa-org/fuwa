/**
  * Utility class to hold bitfields sent by the Discord API.
  * @kind class
  * @see https://en.wikipedia.org/wiki/Bit_field
  */
export abstract class Bitfield {
  /**
   * A constant of the specified bits that can be set in the bitfield.
   * See the children of this class for more details.
   * @readonly
   */
  static Bits: any = {};

  /**
   * Create a new Bitfield with the specified bits.
   * @param bits The bits to set initially.
   * @returns A new Bitfield.
   */
  constructor(public bits: number) {}

  /**
   * Add a bit to the bitfield using the numerical OR operator.
   */
  public add(bit: number): number {
    return (this.bits = this.bits | bit);
  }
  /**
   * Verify whether the bitfield contains the specified bit.
   */
  public has(bit: number): boolean {
    return (this.bits & bit) === bit;
  }
  /**
   * Remove a bit from the bitfield using the numerical AND operator.
   */
  public remove(bit: number): number {
    return (this.bits = this.bits & ~bit);
  }

  /**
   * Returns a string representation of the bitfield.
   */
  public toString(): string {
    return this.bits.toString();
  }

  /**
   * Filter through the bitfield's set {@link Bitfield.Bits} and return an array of the names of the bits that are set.
   */
  public toArray(): string[] {
    return Object.entries<number>(
      
      (this.constructor as unknown as any).Bits,
    ).filter(([, bit]) => this.has(bit))
      .map(([bit]) => bit);
  }

  /**
   * Filters through the bitfield's set {@link Bitfield.Bits} and returns an array of the bits that are set.
   */
  public toJSON(): number[] {
    return Object.values<number>(
      
      
      
      (this.constructor as unknown as any).Bits,
    ).filter(bit => this.has(bit));
  }
}
