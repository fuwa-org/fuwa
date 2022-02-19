import { APIRequest } from './Request';
import { RequestManager } from './RequestManager';
import { AxiosResponse } from 'axios';
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
    handleRateLimit(req: APIRequest, res: AxiosResponse): Promise<AxiosResponse<any, any>>;
    get limited(): boolean;
    get localLimited(): boolean;
    queue(req: APIRequest): Promise<AxiosResponse>;
}
