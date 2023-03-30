type LispNode = number | string | Array<LispNode>;

export function parse(code: string): LispNode {
  return JSON.parse(code.replace(/\(/g, "[").replace(/\)/g, "]"));
}

export function compile(node: LispNode): string {
  if (typeof node === "number") {
    return node.toString();
  } else if (typeof node === "string") {
    return node;
  } else {
    const [head, ...tail] = node;
    switch (head) {
      case "+":
      case "-":
      case "*":
      case "/":
        return `(${tail.map(compile).join(` ${head} `)})`;
      case "define":
        if (Array.isArray(tail[0])) {
          const [funcName, ...args] = tail[0];
          return `function ${funcName}(${args.join(", ")}) { return ${compile(
            tail[1]
          )}; }`;
        } else {
          return `const ${tail[0]} = ${compile(tail[1])};`;
        }
      default:
        return `${head}(${tail.map(compile).join(", ")})`;
    }
  }
}

/* Usage example
export function lispToJs(code: string): string {
  const lispAst = parse(code);
  return compile(lispAst);
}
*/
