import { it, expect } from "vitest";
import { transformToNumber } from "./transformToNumber";

it("Should return the transformed number of the provided number as string", () => {
  const input = "123";

  const result = transformToNumber(input);

  expect(result).toBeTypeOf("number");
  expect(isNaN(result)).not.toBe(true);
});
