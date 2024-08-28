import { sum } from "../src/main";

test("deve somar 2 + 2", () => {
  expect(sum(2, 2)).toBe(4);
})