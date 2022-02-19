export declare class RESTError extends Error {
    response: any;
    data?: any;
    constructor(route: string, code: number, method: string, response: any, data?: any);
}
