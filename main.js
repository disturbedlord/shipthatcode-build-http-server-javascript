"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = require("fs").readFileSync(0, "utf8").split("\n");
let i = 0;
class Trie {
  children = new Array(128).fill(undefined);
  isParam = false;
  isEnd = false;
  path = "";
  param = "";
  verb = "";
  action = "";
}
const isSlash = (x) => {
  if (x === "/") return true;
  else return false;
};
const root = new Trie();
const AddPathToTrie = (p, a, v) => {
  let head = root;
  for (let i = 0; i < p.length; i++) {
    if (p[i] === "{") {
      let param = "";
      while (p[i] !== "}") {
        if (p[i] != "{" && p[i] != "}") {
          param += p[i];
        }
        i++;
      }
      head.param = param; // {id} / {post}
      head.isParam = true;
    } else {
      //if not params or query
      const idx = p[i].charCodeAt(0);
      if (head.children[idx] === undefined) head.children[idx] = new Trie();
      head = head.children[idx];
    }
  }
  head.isEnd = true;
  head.verb = v;
  head.action = a;
};
const HandleRequest = (p, v) => {
  let head = root;
  let i = 0;
  let action = "";
  let attr = [];
  const getIdx = (x) => x.charCodeAt(0);
  while (i < p.length && head != undefined) {
    let idx = getIdx(p[i]);
    if (!head.isParam && !head.children[idx] && p[i] !== "?") break;
    //console.log(idx);
    if (head.children[idx]) head = head.children[idx];
    else {
      //console.log(p[i]);
      if (head.isParam) {
        let paramVal = "";
        while (i < p.length && p[i] !== "/") {
          paramVal += p[i];
          i++;
        }
        attr.push(`${head.param}=${paramVal}`);
        if (i < p.length && p[i] === "/") continue;
      } else if (head.isEnd) {
        //Handle Query String
        if (p[i] === "?") {
          i++;
          let q = "";
          while (i < p.length) {
            if (p[i] === "&") {
              attr.push(`${q}`);
              q = "";
            } else {
              q += p[i];
            }
            i++;
          }
          if (q !== "") attr.push(q);
        }
      }
    }
    i++;
  }
  if (head && head.isEnd) {
    if (head.isParam && attr.length === 0) {
      console.log("404");
    } else {
      attr.sort();
      if (attr.length > 0) console.log(`${head.action} ${attr.join(" ")}`);
      else console.log(head.action);
    }
  } else {
    console.log("404");
  }
  // console.log(attr);
};
let mode = 0;
while (i < data.length) {
  if (data[i] === "") {
    mode++;
  } else {
    switch (mode) {
      case 0: {
        const [verb, path, action] = data[i] ? data[i].split(" ") : [];
        AddPathToTrie(path, action, verb);
        break;
      }
      case 1: {
        const [verb, path] = data[i] ? data[i].split(" ") : [];
        HandleRequest(path, verb);
        break;
      }
    }
  }
  i++;
}
let d = root;
const test = (d) => {
  let f = 0;
  for (let i = 0; i < 27; i++) {
    if (d.children[i] !== undefined) {
      console.log(String.fromCharCode(i + 97), d.children[i]);
      test(d.children[i]);
      f = 1;
    }
  }
  if (f == 0) return;
};
for (let i = 0; i < 27; i++) {
  if (d.children[i] !== undefined) {
    console.log(String.fromCharCode(i + 97));
    test(d.children[i]);
  }
}
// console.log(root);
//# sourceMappingURL=main.js.map
