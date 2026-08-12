"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = require("fs").readFileSync(0, "utf8").split("\n");
let i = 0;
let content = "";
while (i < data.length) {
    let recvContentLength = data[i].trim();
    let contentLength = parseInt(recvContentLength, 16);
    if (contentLength === 0)
        break;
    if (i + 1 < data.length) {
        let contentToParse = data[i + 1].substring(0, contentLength);
        content += contentToParse;
    }
    i += 2;
}
console.log(content);
//# sourceMappingURL=main.js.map