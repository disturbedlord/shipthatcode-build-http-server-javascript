const lines = require('fs').readFileSync(0, 'utf8').split('\n');
const METHODS = new Set(["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"]);

function isVersion(s) {
  // TODO: return true only if s matches /^HTTP\/\d+\.\d+$/
  return s.startsWith("HTTP/");
}

for (const raw of lines) {
  const line = raw.replace(/\r$/, "");
  if (!line) continue;
  const parts = line.split(" ");
  // TODO: 3 parts, method in METHODS, path starts with "/", version valid
  if (parts.length !== 3 || !METHODS.has(parts[0]) || !parts[1].startsWith("/")) {
    console.log("INVALID");
    continue;
  }
  console.log(`METHOD=${parts[0]} PATH=${parts[1]} VERSION=${parts[2]}`);
}
