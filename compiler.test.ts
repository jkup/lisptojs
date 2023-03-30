import { lispToJs } from "./compiler";

const testCases = [
  {
    lisp: "(+ 1 2)",
    expectedJs: "(1 + 2)",
  },
  {
    lisp: "(* (+ 1 2) (- 4 3))",
    expectedJs: "((1 + 2) * (4 - 3))",
  },
  {
    lisp: "(define x 10)",
    expectedJs: "const x = 10;",
  },
  {
    lisp: "(define (add a b) (+ a b))",
    expectedJs: "function add(a, b) { return (a + b); }",
  },
  {
    lisp: "(add 10 20)",
    expectedJs: "add(10, 20)",
  },
  {
    lisp: "(define (sum a b) (+ a b)) (sum 10 20)",
    expectedJs: "function sum(a, b) { return (a + b); } sum(10, 20)",
  },
  {
    lisp: "(+)",
    expectedJs: "0",
  },
  {
    lisp: "(+ 1 2 (",
    errorMessage: "Unexpected EOF",
  },
  {
    lisp: "(+ 1 2 ())",
    expectedJs: "(1 + 2)",
  },
  {
    lisp: "(+ 1 # 2)",
    errorMessage: "Unexpected token",
  },
];

testCases.forEach(({ lisp, expectedJs, errorMessage }, i) => {
  test(`Test case ${i + 1}`, () => {
    try {
      const result = lispToJs(lisp);
      expect(result).toEqual(expectedJs);
    } catch (error: any) {
      if (errorMessage) {
        expect(error.message).toEqual(errorMessage);
      } else {
        throw error;
      }
    }
  });
});
