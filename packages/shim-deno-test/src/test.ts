import { definitions } from "./definitions.js";
import * as Deno from "./deno.types.gen.js";

export const test: typeof Deno.test = function test() {
  let testDef: Deno.TestDefinition;
  const firstArg = arguments[0];
  const secondArg = arguments[1];
  const thirdArg = arguments[2];

  if (typeof firstArg === "string") {
    if (typeof secondArg === "object") {
      if (typeof thirdArg === "function") {
        if (secondArg.fn != null) {
          throw new TypeError(
            "Unexpected 'fn' field in options, test function is already provided as the third argument.",
          );
        }
      }
      if (secondArg.name != null) {
        throw new TypeError(
          "Unexpected 'name' field in options, test name is already provided as the first argument.",
        );
      }
      // name, options, fn
      testDef = { name: firstArg, fn: thirdArg, ...secondArg };
    } else {
      // name, fn
      testDef = { name: firstArg, fn: secondArg };
    }
  } else if (firstArg instanceof Function) {
    // function only
    if (firstArg.name.length === 0) {
      throw new TypeError("The test function must have a name");
    }
    testDef = { fn: firstArg, name: firstArg.name };

    if (secondArg != null) {
      throw new TypeError("Unexpected second argument to Deno.test()");
    }
  } else if (typeof firstArg === "object") {
    testDef = { ...firstArg };
    if (typeof secondArg === "function") {
      // options, fn
      testDef.fn = secondArg;
      if (firstArg.fn != null) {
        throw new TypeError(
          "Unexpected 'fn' field in options, test function is already provided as the second argument.",
        );
      }
      if (testDef.name == null) {
        if (secondArg.name.length === 0) {
          throw new TypeError("The test function must have a name");
        }
        // options without name, fn
        testDef.name = secondArg.name;
      }
    } else {
      if (typeof firstArg.fn !== "function") {
        throw new TypeError(
          "Expected 'fn' field in the first argument to be a test function.",
        );
      }
    }
  } else {
    throw new TypeError("Unknown test overload");
  }

  if (typeof testDef.fn !== "function") {
    throw new TypeError("Missing test function");
  }

  if ((testDef.name?.length ?? 0) === 0) {
    throw new TypeError("The test name can't be empty");
  }

  definitions.push(testDef);
};
