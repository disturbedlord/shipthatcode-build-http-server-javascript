type STATUS_CODES =
  | 200
  | 201
  | 204
  | 301
  | 302
  | 304
  | 400
  | 401
  | 403
  | 404
  | 405
  | 500;

const STATUS_TEXT = {
  200: "OK",
  201: "Created",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  304: "Not Modified",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  500: "Internal Server Error",
};

class Response {
  statusCode: STATUS_CODES = 200;
  headerCount = 0;
  headers: Map<string, string> = new Map();
  body: string = "";

  formatStatusLine = () =>
    `HTTP/1.1 ${this.statusCode} ${STATUS_TEXT[this.statusCode]}`;
  formatHeader = (key: string, val: string) => `${key} ${val}`;
  appendHeaders = () => {
    let requestHeaders: string[] = [];
    this.headers.forEach((v: string, k: string) => {
      requestHeaders.push(this.formatHeader(k, v));
    });
    return requestHeaders.join("\r\n");
  };

  appendDelimiter = () => "\r\n";
  appendBody = () => (this.body != "" ? this.body : "");
  ToString = () => {
    console.log(
      `${this.formatStatusLine()}${this.appendDelimiter()}${this.appendHeaders()}${this.appendDelimiter()}${this.appendDelimiter()}${this.appendBody()}`,
    );
  };
}

const STATES = {
  1: "StatusCode",
  2: "headers",
  3: "body",
};

const data: string[] = require("fs").readFileSync(0, "utf8").split("\n");
let i = 0;
let currentState = 1; // Parse Status Line
const res = new Response();
while (i < data.length) {
  switch (currentState) {
    case 1: {
      let [code, headerCount] = data[i]?.split(" ")!;
      res.statusCode = Number(code) as STATUS_CODES;
      res.headerCount = +headerCount!;

      currentState++; // Parse Headers
      if (+headerCount! === 0) currentState = 3;
      break;
    }
    case 2: {
      //console.log(res.headerCount);
      if (res.headerCount > 0) {
        let header = data[i]?.split(" ")!;
        let key = header[0];
        let value = header.slice(1).join(" ");
        key = key?.trim();
        value = value?.trim();
        if (key && value) res.headers.set(key, value);
        res.headerCount--;
      }
      if (res.headerCount === 0) {
        currentState++; // Parse Body
      }
      break;
    }
    case 3: {
      res.body += data[i]!;
    }
  }
  i++;
}
res.headers.set("Content-Length:", res.body.length.toString());
res.ToString();
