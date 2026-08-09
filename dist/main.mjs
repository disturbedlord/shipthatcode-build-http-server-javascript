const lines = require("fs").readFileSync(0, "utf8").split("\n");
import Logger from "./Logger.mjs";
let headerMap = new Map();
const NormalizeHeader = (line) => {
    const ToLowerCase = (inp) => inp.toLowerCase();
    const TrimSurroundingSpace = (inp) => inp.trim();
    if (!line.includes(":")) {
        return `ERR malformed: ${line}`;
    }
    const idx = line.indexOf(":");
    const name = line.slice(0, idx);
    const value = line.slice(idx + 1);
    const normalizedName = ToLowerCase(name);
    const normalizedValue = TrimSurroundingSpace(value);
    headerMap.set(normalizedName, normalizedValue);
    return `${normalizedName}: ${normalizedValue}`;
};
const logger = new Logger(0);
for (const raw of lines) {
    const line = raw.replace(/\r$/, "");
    if (!line)
        break;
    // TODO: if no ':' in line, print `ERR malformed: ${line}` and continue
    // TODO: lowercase + strip name; strip value
    logger.prod(NormalizeHeader(line));
}
headerMap.forEach((v, k) => logger.log(`${k} -> ${v}`));
//# sourceMappingURL=main.mjs.map