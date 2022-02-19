export class RESTError extends Error {
  constructor(route: string, code: number, method: string, public response: any, public data?: any) {
    super();
    this.message = `Error ${code} occurred while ${method} ${route}.`;
    this.name = "RESTError";
  }
}
