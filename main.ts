const data: string[] = require("fs").readFileSync(0, "utf8").split("\n");

class Tree {
  type: "static" | "param" | "" = "";
  isEnd: boolean = false;
  value: string = "";
  children: Tree[] = [];
  constructor(v: string) {
    this.value = v;
  }
  route?: {
    verb: string;
    action: string;
  }[] = [];
}

let i = 0;
let mode = 0;

const parseRequest = (s: string) => {
  let resources = [] as string[];
  let i = 0;
  let resource = "";
  while (i < s.length) {
    if (s[i] === "?") {
      if (resource != "") {
        resources.push(resource);
        resource = "";
      }
      resources.push(s.substring(i));
      break;
    }
    if (s[i] === "/") {
      if (resource != "") resources.push(resource);
      resource = "";
    } else {
      resource += s[i];
    }
    i++;
  }
  if (resource !== "") resources.push(resource);

  return resources;
};

const TreeHelper = {
  searchByValue: (node: Tree, search: string) => {
    let i = 0;
    while (i < node.children.length) {
      const curr = node.children[i];
      if (curr?.value === search) return curr;
      i++;
    }

    return null;
  },
};

const root = new Tree("root");

const addToTree = (components: string[], v: string, a: string) => {
  let head = root;
  components.forEach((ele) => {
    let node = TreeHelper.searchByValue(head, ele);
    if (!node) {
      // Create a new Node in Tree
      node = new Tree(ele);
      node.type = ele.startsWith("{") ? "param" : "static";
      head.children.push(node);
    }
    head = node;
  });
  head.isEnd = true;
  head.route?.push({
    verb: v,
    action: a,
  });
};

const matchRoute = (components: string[], verb: string) => {
  //console.log("======================", components);
  let head = root;
  let i = 0;
  let leafNode: Tree | undefined = undefined;
  let paramNodes: string[] = [];
  const traverseTree = (node: Tree, components: string[], i: number) => {
    if (i >= components.length || !node) return;
    if (components[i]?.startsWith("?")) return node;
    let foundNode = TreeHelper.searchByValue(node, components[i]!);
    //console.log("------------\n", foundNode);
    if (!foundNode && node.children.length === 1) {
      if (node.children[0]?.type === "param") {
        paramNodes.push(
          `${node.children[0].value.substring(1, node.children[0].value.length - 1)}=${components[i]}`,
        );
      }

      if (i < components.length - 1) {
        foundNode = node.children[0]!;
      } else {
        if (node.children[0]?.isEnd === true) {
          return node.children[0];
        }
      }
    }

    if (!foundNode) return;
    // if (foundNode && foundNode.isEnd && i === components.length - 1) {
    //   return foundNode;
    // }

    return traverseTree(foundNode, components, i + 1);
  };

  leafNode = traverseTree(head, components, 0);
  paramNodes.sort();
  //console.log(leafNode);
  if (leafNode) {
    let action = "";
    leafNode.route?.forEach((r) => {
      if (r.verb == verb) {
        action = r.action;
      }
    });

    if (paramNodes.length > 0) console.log(`${action} ${paramNodes.join(" ")}`);
    else {
      console.log(`${action}`);
    }
  } else {
    console.log("404");
  }
};

while (i < data.length) {
  if (data[i] === "") {
    mode = 1;
  } else {
    switch (mode) {
      case 0: {
        const [verb, path, action] = data[i]?.split(" ")!;
        const pathComponents = parseRequest(path!);
        addToTree(pathComponents, verb!, action!);
        //console.log(pathComponents);
        break;
      }
      case 1: {
        const [verb, path] = data[i]?.split(" ")!;
        const pathComponents = parseRequest(path!);
        //console.log(pathComponents);
        matchRoute(pathComponents, verb!);
        break;
      }
    }
  }
  i++;
}

const visualizeTree = (root: Tree) => {
  root.children.forEach((child) => {
    console.log(
      child.type,
      child.value,
      child.isEnd,
      child.children.length,
      child.route,
    );
    visualizeTree(child);
  });
};

//visualizeTree(root);
