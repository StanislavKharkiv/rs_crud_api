import { IncomingMessage, ServerResponse } from "node:http";

export function getReqData(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function deleteWrongFields(obj: Record<string, any>) {
  const requiredFields = ["username", "age", "hobbies", "id"];
  const newObject = { ...obj };
  for (const key in newObject) {
    if (!requiredFields.includes(key)) delete newObject[key];
  }
  return newObject;
}

export class userResponse {
  #res;
  constructor(response: ServerResponse) {
    this.#res = response;
    this.addHeaders();
  }
  addHeaders() {
    this.#res.setHeader("Access-Control-Allow-Origin", "*");
  }
  noUserResp() {
    this.#res.writeHead(404);
    this.#res.end("User doesn't exist!");
  }
  notFound() {
    this.#res.writeHead(404);
    this.#res.end("Not found");
  }
  send(status: number, data?: string) {
    this.#res.writeHead(status, { "Content-Type": "application/json" });
    this.#res.end(data);
  }
}
