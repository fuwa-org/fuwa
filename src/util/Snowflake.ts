function deconstruct(id: Snowflake) {
  let num = BigInt(id);

  return {
    id: num,
    timestamp: (num >> BigInt(22)) + EPOCH,
    worker: (num >> 17n) & 0b11111n,
    process: (num >> 12n) & 0b11111n,
    increment: num & 0b111111111111n,
    epoch: EPOCH,
  };
}

export class SnowflakeInfo {
  id: BigInt;
  timestamp: number;
  worker: number;
  process: number;
  increment: number;
  epoch: number;

  constructor(id: Snowflake) {
    const {
      id: _id,
      timestamp,
      worker,
      process,
      increment,
      epoch,
    } = deconstruct(id);
    this.id = _id;
    this.timestamp = Number(timestamp);
    this.worker = Number(worker);
    this.process = Number(process);
    this.increment = Number(increment);
    this.epoch = Number(epoch);
  }

  toString() {
    return `SnowflakeInfo(id=${this.id}, timestamp=${this.timestamp}, worker=${this.worker}, process=${this.process}, increment=${this.increment}, epoch=${this.epoch})`;
  }
}

export type Snowflake = string;
export const EPOCH = 1420070400000n;
