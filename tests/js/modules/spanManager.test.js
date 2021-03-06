import { SpanManager } from "modules/spanManager.js";

const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

describe("SpanManager", function () {
  it("has the correct data", function () {
    let sm = new SpanManager(
      [".it", ".is", ".h-6", ".oclock"],
      [".it", ".is", ".h-6", ".oclock", ".m-1"]
    );

    expect(sm.current).toEqual([".it", ".is", ".h-6", ".oclock"]);
    expect(sm.next).toEqual([".it", ".is", ".h-6", ".oclock", ".m-1"]);
  });

  it("assumes correct defaults", function () {
    let sm = new SpanManager(null, null);

    expect(sm.current).toEqual([]);
    expect(sm.next).toEqual([]);
  });

  it("knows when it has diffs", function () {
    let sm = new SpanManager(["foo"], ["foo", "bar"]);

    expect(sm.diffs).toEqual(true);
  });

  it("knows when it has no diffs", function () {
    let sm = new SpanManager(["foo"], ["foo"]);

    expect(sm.diffs).toEqual(false);
  });

  it("knows which spans to (de)activate", function () {
    let sm = new SpanManager(
      [
        ".it",
        ".is",
        ".twentyfive",
        ".past",
        ".h-6",
        ".m-1",
        ".m-2",
        ".m-3",
        ".m-4",
      ],
      [".it", ".is", ".half", ".past", ".h-6"]
    );

    expect(sm.activate).toEqual([".half"]);
    expect(sm.deactivate).toEqual([
      ".twentyfive",
      ".m-1",
      ".m-2",
      ".m-3",
      ".m-4",
    ]);
  });

  it("diffs correctly when there's no `current` list", function () {
    let sm = new SpanManager([], ["#it", "#is", "#half", "#past", "#h-2"]);

    expect(sm.diffs).toEqual(true);
    expect(sm.activate).toEqual(["#it", "#is", "#half", "#past", "#h-2"]);
  });

  it("(de)activates spans correctly", function () {
    let sm = new SpanManager(
      [
        ".it",
        ".is",
        ".twentyfive",
        ".past",
        ".h-6",
        ".m-1",
        ".m-2",
        ".m-3",
        ".m-4",
      ],
      [".it", ".is", ".half", ".past", ".h-6"]
    );

    sm.yeet();

    expect(consoleLogMock).toBeCalledWith(".it .is .half .past .h-6");
  });
});
