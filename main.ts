const lines = require("fs").readFileSync(0, "utf8").split("\n");

class Logger {
  private env: number; // 0 -> Dev , 1 -> Prod

  constructor(env: number) {
    this.env = env;
  }

  log = (s: string | string[]) =>
    this.env === 0 ? console.log("[LOG] : ", s) : null;
  prod = (s: string) => console.log(s);
}

let headerMap = new Map();

const NormalizeHeader = (line: string): string => {
  const ToLowerCase = (inp: string) => inp.toLowerCase();
  const TrimSurroundingSpace = (inp: string) => inp.trim();

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
  if (!line) break;
  // TODO: if no ':' in line, print `ERR malformed: ${line}` and continue

  // TODO: lowercase + strip name; strip value
  logger.prod(NormalizeHeader(line));
}

//headerMap.forEach((v: string, k: string) => logger.log(`${k} -> ${v}`));
