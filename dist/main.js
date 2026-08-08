"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lines = require("fs").readFileSync(0, "utf8").split("\n");
const METHODS = new Set([
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "HEAD",
    "OPTIONS",
    "PATCH",
]);
class Logger {
    env = 1; // 0 -> Dev , 1 -> Prod
    log = (s) => this.env === 0 ? console.log("[LOG] : ", s) : null;
    prod = (s) => console.log(s);
}
class HttpParser {
    logger = new Logger();
    isVersion = (s) => {
        let httpVersionRegex = new RegExp("HTTP/\\d\\.\\d", "gm");
        return httpVersionRegex.test(s);
    };
    parse = (line) => {
        const parts = line.split(" ");
        this.logger.log(parts);
        if (parts.length !== 3 ||
            !METHODS.has(parts[0]) ||
            !parts[1].startsWith("/") ||
            !this.isVersion(parts[2])) {
            this.logger.prod("INVALID");
            return;
        }
        this.logger.prod(`METHOD=${parts[0]} PATH=${parts[1]} VERSION=${parts[2]}`);
    };
}
const parser = new HttpParser();
for (const raw of lines) {
    const line = raw.replace(/\r$/, "");
    if (!line)
        continue;
    parser.parse(line);
}
//# sourceMappingURL=main.js.map