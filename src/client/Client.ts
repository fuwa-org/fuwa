import { APIRequest } from '../index.js';
import { RequestManager } from '../rest/RequestManager.js';
import { RESTClient } from '../rest/RESTClient';
import { ClientOptions, DefaultClientOptions } from './ClientOptions';

export class Client {
  #token: string;
  public http: RequestManager;
  public options: ClientOptions;

  public constructor(token: string, options?: ClientOptions) {
    this.options = options = Object.assign(options ?? {}, DefaultClientOptions);

    this.#token = token;

    this.http = new RequestManager(
      new RESTClient(RESTClient.createRESTOptions(options, token, 'Bot'))
    );
  }

  public async connect(): Promise<void> {
    await this.http
      .queue(new APIRequest('/gateway/bot'))
      .then((res) => res.data);
  }
}
