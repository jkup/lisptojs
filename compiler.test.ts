import { lispToJs } from "./compiler";

describe("Lisp to JavaScript Compiler", () => {
  const testCases = [
    {
      lisp: "(+ 1 2)",
      expectedJs: "(1 + 2)",
    },
    {
      lisp: "(* 3 4)",
      expectedJs: "(3 * 4)",
    },
    {
      lisp: "(define x 10)",
      expectedJs: "const x = 10;",
    },
    {
      lisp: "(define (add x y) (+ x y))",
      expectedJs: "function add(x, y) { return (x + y); }",
    },
    {
      lisp: "(add 5 6)",
      expectedJs: "add(5, 6)",
    },
    {
      lisp: "(define (multiply a b) (* a b))",
      expectedJs: "function multiply(a, b) { return (a * b); }",
    },
    {
      lisp: "(multiply 2 8)",
      expectedJs: "multiply(2, 8)",
    },
  ];

  testCases.forEach(({ lisp, expectedJs }, i) => {
    test(`Test case ${i + 1}`, () => {
      expect(lispToJs(lisp)).toEqual(expectedJs);
    });
  });
});
