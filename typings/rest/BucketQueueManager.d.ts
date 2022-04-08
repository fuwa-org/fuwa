import { APIRequest } from './APIRequest';
import { RequestManager } from './RequestManager';
import { ResponseData } from 'undici/types/dispatcher';
export declare class BucketQueueManager {
    #private;
    private readonly manager;
    readonly id: string;
    readonly majorId: string;
    limit: number;
    remaining: number;
    reset: number;
    constructor(manager: RequestManager, id: string, majorId: string);
    private applyRateLimitInfo;
    get durUntilReset(): number;
    handleRateLimit(req: APIRequest, res: ResponseData): Promise<ResponseData>;
    get limited(): boolean;
    get localLimited(): boolean;
    queue(req: APIRequest): Promise<ResponseData>;
    private debug;
}
