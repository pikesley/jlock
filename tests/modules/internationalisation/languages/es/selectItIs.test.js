import { selectItIs } from "modules/jlock.js";

describe("selectItIs for Spanish", function () {
  it("selects the correct `.it .is` classes", function () {
    [
      [12, 0, [".it", ".is"]],
      [12, 30, [".it", ".is"]],
      [12, 35, [".special-it", ".special-is"]],
      [12, 40, [".special-it", ".special-is"]],
      [12, 45, [".special-it", ".special-is"]],
      [12, 50, [".special-it", ".special-is"]],
      [12, 55, [".special-it", ".special-is"]],
      [13, 0, [".special-it", ".special-is"]],
      [13, 5, [".special-it", ".special-is"]],
      [13, 10, [".special-it", ".special-is"]],
      [13, 15, [".special-it", ".special-is"]],
      [13, 20, [".special-it", ".special-is"]],
      [13, 25, [".special-it", ".special-is"]],
      [13, 30, [".it", ".special-is"]],
      [13, 35, [".it", ".is"]],
      [14, 0, [".it", ".is"]],
    ].forEach(function (fixture) {
      expect(
        selectItIs({ hours: fixture[0], minutes: fixture[1] }, "es")
      ).toEqual(fixture[2]);
    });
  });
});
