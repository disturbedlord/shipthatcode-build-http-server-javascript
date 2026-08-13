const data: string[] = require("fs").readFileSync(0, "utf8").split("\n");

interface Handler {
  verb: string;
  action: string;
}

class Routing {
  private path: string = "";
  handlers: Handler[] = [];
  constructor(p: string) {
    this.path = p;
  }

  setHandler = (x: Handler) => this.handlers.push(x);
}

let routes = new Map<string, Routing>();

const getResponse = (path: string, v: string) => {
  const Ok = (s: string) => `200 ${s}`;
  const MethodNotAllowed = () => `405`;
  const NotFound = () => `404`;

  path = path.slice(0, path.includes("?") ? path.indexOf("?") : path.length);
  //console.log(path);
  if (!routes.has(path)) return NotFound();

  const route = routes.get(path);
  if (route !== undefined) {
    let flag: boolean = false;

    for (let i = 0; i < route.handlers.length; i++) {
      let handle = route.handlers[i];
      if (handle?.verb === v) {
        flag = true;
        return Ok(handle.action);
      }
    }

    if (!flag) return MethodNotAllowed();
  }
};

let i = 0;
let mode = 0; // 0 : Routing Table , 1 : Request Processing
while (i < data.length) {
  if (data[i] === "") {
    mode++; // change to Request processing Mode
    //console.log(routes);
  } else {
    switch (mode) {
      case 0: {
        const [verb, path, action] = data[i]?.split(" ")!;

        if (path === undefined || verb === undefined || action === undefined) {
          break;
        }
        //console.log(verb, path, action);
        let handler: Handler = {
          verb: verb,
          action: action,
        };

        let route: Routing;
        if (routes.has(path)) {
          route = routes.get(path)!;
        } else {
          route = new Routing(path);
          routes.set(path, route);
        }

        route.setHandler(handler);
        break;
      }
      case 1: {
        let [verb, path] = data[i]?.split(" ")!;
        if (verb === undefined || path === undefined) continue;

        console.log(getResponse(path, verb));

        break;
      }
    }
  }

  i++;
}
