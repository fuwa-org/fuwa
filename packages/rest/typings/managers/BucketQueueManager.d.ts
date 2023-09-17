import Dispatcher from 'undici/types/dispatcher';
import { APIRequest } from '../client/APIRequest';
import { RequestManager } from './RequestManager';
import { TypedResponseData } from '../client/RESTClient';
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
    handleRateLimit<D>(req: APIRequest, res: Dispatcher.ResponseData): Promise<TypedResponseData<D>>;
    get limited(): boolean;
    get localLimited(): boolean;
    isLimited(global?: boolean): false | {
        global: boolean;
    };
    queue<D = unknown>(req: APIRequest): Promise<TypedResponseData<D>>;
    private debug;
}
