import { APIRequest } from "./Request";
import { RequestManager } from "./RequestManager";
import { AxiosResponse } from "axios";
export declare class BucketQueueManager {
    #private;
    private readonly manager;
    private readonly bucketId;
    readonly id: string;
    reset: number;
    remaining: number;
    limit: number;
    constructor(manager: RequestManager, bucketId: string);
    get localLimited(): boolean;
    get limited(): boolean;
    get durUntilReset(): Promise<AxiosResponse>;
    queue(req: APIRequest): any;
}
