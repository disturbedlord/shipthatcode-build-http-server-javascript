"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lines = require("fs").readFileSync(0, "utf8").split("\n");
class RouteTree {
    value = "";
    isEnd = false;
    routeInfo = [];
    children = [];
    constructor(v) {
        this.value = v;
    }
    addChild = (v, e, verb, h) => {
        //console.log(v, e, verb, h);
        const newNode = new RouteTree(v);
        newNode.isEnd = e;
        if (e && verb && h)
            newNode.routeInfo.push({ verb: verb, handler: h });
        this.children.push(newNode);
        //console.log(newNode);
        return newNode;
    };
    static getChild = (node, search) => {
        return node.children.filter((e) => e.value == search)[0];
    };
}
class Server {
    root = new RouteTree("root");
    parseRoute = (p) => {
        let routeComponents = [];
        routeComponents.push("/");
        routeComponents = routeComponents.concat(p.split("/").filter((e) => e !== ""));
        //console.log(p, routeComponents);
        return routeComponents;
    };
    addRouteToTree = (c, verb, handler) => {
        let head = this.root;
        for (let i = 0; i < c.length; i++) {
            let existingNode = RouteTree.getChild(head, c[i]);
            if (!existingNode) {
                existingNode = head.addChild(c[i], i == c.length - 1 ? true : false, verb, handler);
            }
            head = existingNode;
        }
    };
    LogRequest = (verb, path, statusCode, cLength) => console.log(`LOG ${verb} ${path} ${statusCode} ${cLength}`);
    handleRequest = (c, path, v, b = "") => {
        let head = this.root;
        const NotFound = () => {
            console.log("404");
            this.LogRequest(v, path, 404, 0);
        };
        const MethodNotAllowed = () => {
            console.log("405");
            this.LogRequest(v, path, 405, 0);
        };
        const Ok = (response, contentLength) => {
            console.log(`${response} ${contentLength.toString()}`);
            this.LogRequest(v, path, 200, contentLength);
        };
        for (let i = 0; i < c.length; i++) {
            let existingNode = RouteTree.getChild(head, c[i]);
            if (!existingNode) {
                NotFound();
                break;
            }
            else {
                head = existingNode;
            }
            if (i === c.length - 1) {
                // Last element
                let route = existingNode.routeInfo.filter((r) => r.verb == v);
                if (route && route[0]) {
                    Ok(route[0].handler, b.length);
                }
                else {
                    MethodNotAllowed();
                }
            }
        }
    };
    visualizeTree = (head) => {
        if (!head)
            return;
        //console.log(head.value, head.isEnd, head.routeInfo, head.children.length);
        head.children.forEach((e) => {
            this.visualizeTree(e);
        });
    };
}
const server = new Server();
for (let line of lines) {
    if (line === "")
        continue;
    const inp = line.split(" ");
    if (inp) {
        const cmd = inp[0];
        switch (cmd) {
            case "ROUTE": {
                const verb = inp[1], path = inp[2], handler = inp[3];
                const sanitizedPath = path.includes("?")
                    ? path.substring(0, path.indexOf("?"))
                    : path;
                const routeComponents = server.parseRoute(sanitizedPath);
                //console.error("------------", verb);
                server.addRouteToTree(routeComponents, verb, handler);
                break;
            }
            case "REQUEST": {
                const verb = inp[1], path = inp[2], body = inp[3] ?? "";
                const sanitizedPath = path.includes("?")
                    ? path.substring(0, path.indexOf("?"))
                    : path;
                const routeComponents = server.parseRoute(path);
                server.handleRequest(routeComponents, sanitizedPath, verb, body);
                break;
            }
        }
    }
}
//console.log("================");
server.visualizeTree(server.root);
//# sourceMappingURL=main.js.map