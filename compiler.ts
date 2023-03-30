type LispNode = number | string | Array<LispNode>;

function tokenize(code: string): string[] {
  return code.replace(/\(/g, " ( ").replace(/\)/g, " ) ").trim().split(/\s+/);
}

function readFromTokens(tokens: string[]): LispNode {
  if (tokens.length === 0) {
    throw new SyntaxError("Unexpected EOF");
  }

  const token = tokens.shift();
  if (token === undefined) {
    throw new SyntaxError("Unexpected token");
  } else if (token === "(") {
    const list = [];
    while (tokens.length > 0) {
      if (tokens[0] === ")") {
        tokens.shift(); // Discard ')'
        break;
      }
      list.push(readFromTokens(tokens));
    }
    if (tokens.length === 0 && list.length === 0) {
      throw new SyntaxError("Expected )");
    }
    return list;
  } else if (token === ")") {
    throw new SyntaxError("Unexpected )");
  } else {
    return atom(token);
  }
}

function atom(token: string): LispNode {
  if (token.match(/[^a-zA-Z0-9_+\-*/]/)) {
    throw new SyntaxError("Unexpected token");
  }

  const number = Number(token);
  if (isNaN(number)) {
    return token;
  } else {
    return number;
  }
}

function parse(code: string): LispNode {
  const tokens = tokenize(code);
  return readFromTokens(tokens);
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
        if (tail.length === 0) {
          return "0";
        } else {
          return `(${tail.map(compile).join(" + ")})`;
        }
      case "-":
      case "*":
      case "/":
        if (tail.length === 0) {
          throw new SyntaxError(`Expected at least one operand for ${head}`);
        }
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

export function lispToJs(code: string): string {
  const lispAst = parse(code);
  return compile(lispAst);
}
