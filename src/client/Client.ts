import { RESTClient } from "../rest/RESTClient";
import { ClientOptions, DefaultClientOptions } from "./ClientOptions"

export class Client {
  #token: string;
  public options: ClientOptions;
  public http: RESTClient;

  public constructor(token: string, options?: ClientOptions) {
    this.options = options = Object.assign(options ?? {}, DefaultClientOptions);

    this.#token = token;

    this.http = new RESTClient(RESTClient.createRESTOptions(this.options, this.#token, "Bot"));
  }

  public async connect(): Promise<void> {

  }
}
