"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lines = require("fs").readFileSync(0, "utf8").split("\n");
class UrlTree {
    pattern = "";
    children = [];
    isEnd = false;
    siteId = "";
    constructor(v) {
        this.pattern = v;
    }
    static FindNode = (n, s) => {
        const e = n.children.filter((x) => x.pattern === s);
        if (e && e.length > 0)
            return e[0];
    };
}
const parsePattern = (p) => {
    p = p.includes(":") ? p.split(":").at(0) : p;
    return p.split(".").reverse();
};
const root = new UrlTree("root");
let mode = 0;
for (let line of lines) {
    if (!line) {
        // Handle Empty Host Name
        if (mode === 1)
            console.log("400");
        if (mode === 0)
            mode = 1;
        continue;
    }
    switch (mode) {
        case 0: {
            const [pattern, siteId] = line.split(" ");
            if (pattern && siteId) {
                const components = parsePattern(pattern);
                let head = root;
                components.forEach((c) => {
                    let e = UrlTree.FindNode(head, c);
                    if (!e) {
                        e = new UrlTree(c);
                        head.children.push(e);
                    }
                    head = e;
                });
                head.isEnd = true;
                head.siteId = siteId;
            }
            break;
        }
        case 1: {
            let url = line;
            url = url.toLowerCase();
            const components = parsePattern(url);
            //console.log(components);
            let head = root;
            const TraverseTree = (node, i) => {
                if (!node)
                    return null;
                //console.log("--", components[i], node);
                if (node?.isEnd) {
                    // last element
                    //console.log("-------", components[i]);
                    return node.siteId;
                }
                if (i >= components.length)
                    return null;
                let existing = UrlTree.FindNode(node, components[i]);
                if (existing) {
                    return TraverseTree(existing, i + 1);
                }
                else {
                    const wildcard = UrlTree.FindNode(node, "*");
                    if (wildcard) {
                        return TraverseTree(wildcard, i + 1);
                        // existing = wildcard;
                    }
                }
            };
            const result = TraverseTree(head, 0);
            // Handle No Host Match or result
            console.log(`${result ? result : "404"}`);
            break;
        }
    }
}
const t = (head) => {
    if (!head)
        return;
    console.log(head.pattern, head.isEnd, head.siteId, head.children.length);
    head.children.forEach((x) => t(x));
};
//t(root);
//# sourceMappingURL=main.js.map