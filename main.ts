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

function isVersion(s: string) {
  // TODO: return true only if s matches /^HTTP\/\d+\.\d+$/
  let httpVersionRegex = new RegExp("HTTP/\\d\\.\\d", "gm");
  return httpVersionRegex.test(s);
}

for (const raw of lines) {
  const line = raw.replace(/\r$/, "");
  if (!line) continue;
  const parts = line.split(" ");
  // TODO: 3 parts, method in METHODS, path starts with "/", version valid
  // console.log(parts[2], isVersion(parts[2]));
  if (
    parts.length !== 3 ||
    !METHODS.has(parts[0]) ||
    !parts[1].startsWith("/") ||
    !isVersion(parts[2])
  ) {
    console.log("INVALID");
    continue;
  }
  console.log(`METHOD=${parts[0]} PATH=${parts[1]} VERSION=${parts[2]}`);
}
