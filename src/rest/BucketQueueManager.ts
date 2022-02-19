import { AsyncQueue } from "@sapphire/async-queue";
import { APIRequest } from "./Request";
import { RateLimit, RequestManager } from "./RequestManager";
import { setTimeout as sleep } from "node:timers/promises";
import { AxiosResponse } from "axios";

export class BucketQueueManager {
  public readonly id: string;

  /** The UNIX timestamp at which this bucket's rate limit will expire. */
  public reset = -1;
  
  /** The remaining requests we can make until we are rate limited. */
  public remaining = 1;

  /** The total amount of requests that can be made on this bucket before getting rate limited. */
  public limit = Infinity; 

  #queue = new AsyncQueue();

  constructor(private readonly manager: RequestManager, private readonly bucketId: string) {
    this.id = bucketId;
  }

  public get localLimited() {
    return this.remaining === 0 && Date.now() < this.reset;
  }

  public get limited() {
    return this.localLimited
  }

  public get durUntilReset(): Promise<AxiosResponse> {
    return this.reset - Date.now();
  }

  public queue(req: APIRequest) {
    // let running requests finish
    this.#queue.wait();

    if (this.limited) {
      sleep(this.durUntilReset);

      try {
        return await this.runRequest(req);
      } finally {
        this.#queue.shift();
      }
    }
  }
}
