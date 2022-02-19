import { AxiosRequestHeaders } from "axios";
import { RESTClient } from "./RESTClient";

export class APIRequest {
  public route: string;
  public method: HTTPMethod;
  public data?: any;
  public headers: AxiosRequestHeaders = {};

  static get(route: string): APIRequest {
    return new APIRequest(route, "GET");
  }

  static ensureMethod(str: string): HTTPMethod {
    switch (str.toUpperCase()) {
      case "GET":
        return str.toLowerCase() as HTTPMethod;
      default:
        throw new TypeError(`${str} is an unsupported HTTP method.`)
    }
  }

  constructor(route: string, method = "GET") {
    this.route = route;
    this.method = APIRequest.ensureMethod(method);
  }

  public send(client: RESTClient) {
    client.execute(this);
  }
}

type HTTPMethod = "get";
