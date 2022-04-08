import { APIRequest } from './APIRequest';
import { RequestManager } from './RequestManager';
import { ResponseData } from 'undici/types/dispatcher';
export declare class BucketQueueManager {
    #private;
    private readonly manager;
    readonly id: string;
    readonly majorId: string;
    /** The total amount of requests that can be made on this bucket before getting rate limited. */
    limit: number;
    /** The remaining requests we can make until we are rate limited. */
    remaining: number;
    /** The UNIX timestamp at which this bucket's rate limit will expire. */
    reset: number;
    constructor(manager: RequestManager, id: string, majorId: string);
    private applyRateLimitInfo;
    get durUntilReset(): number;
    handleRateLimit(req: APIRequest, res: ResponseData): Promise<any>;
    get limited(): boolean;
    get localLimited(): boolean;
    queue(req: APIRequest): Promise<ResponseData>;
    private debug;
}
