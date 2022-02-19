export class Bitfield {
  public static FLAGS: Record<string, number>

  constructor(public bits: number) {}

  public add(bit: number): number {
    return (this.bits += bit);
  }
  public remove(bit: number): number {
    return (this.bits -= bit);
  }

  public has(bit: number): boolean {
    return (this.bits & bit) === bit;
  }

  public toString(): string {
    return this.bits.toString();
  }
}
