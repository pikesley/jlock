import { run } from "modules/controls.js";
import { gatherSpanIDs } from "./support/helpers.js";

const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

describe("Integration test", function () {
  it("displays the time", async function () {
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:33"));

    let div = global.document.createElement("div");
    div.setAttribute("id", "test-clock");
    global.document.body.appendChild(div);
    run("#test-clock");

    Date.now = jest.fn(() => Date.parse("2021-10-17T18:34"));
    await new Promise((r) => setTimeout(r, 1000));
    expect(consoleLogMock).toBeCalledWith(
      ".it .is .half .past .h-6 .m-1 .m-2 .m-3 .m-4"
    );

    let spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual([
      // 1 minute
      "corner-1",

      // 2 minute
      "corner-2",

      // it
      "cell-0-0",
      "cell-1-0",

      // is
      "cell-3-0",
      "cell-4-0",

      // half
      "cell-0-3",
      "cell-1-3",
      "cell-2-3",
      "cell-3-3",

      // past
      "cell-0-4",
      "cell-1-4",
      "cell-2-4",
      "cell-3-4",

      // six
      "cell-3-5",
      "cell-4-5",
      "cell-5-5",

      // 4 minute
      "corner-4",

      // 3 minute
      "corner-3",
    ]);

    Date.now = jest.fn(() => Date.parse("2021-10-17T18:35"));
    await new Promise((r) => setTimeout(r, 1000));
    expect(consoleLogMock).toBeCalledWith(".it .is .twentyfive .to .h-7");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual([
      // it
      "cell-0-0",
      "cell-1-0",

      // is
      "cell-3-0",
      "cell-4-0",

      // twentyfive
      "cell-0-2",
      "cell-1-2",
      "cell-2-2",
      "cell-3-2",
      "cell-4-2",
      "cell-5-2",
      "cell-6-2",
      "cell-7-2",
      "cell-8-2",
      "cell-9-2",

      // to
      "cell-10-3",
      "cell-11-3",

      // seven
      "cell-0-8",
      "cell-1-8",
      "cell-2-8",
      "cell-3-8",
      "cell-4-8",
    ]);

    expect(spans.inactives).toEqual([
      // minute 1
      "corner-1",

      // minute 2
      "corner-2",

      // half
      "cell-0-3",
      "cell-1-3",
      "cell-2-3",
      "cell-3-3",

      // past
      "cell-0-4",
      "cell-1-4",
      "cell-2-4",
      "cell-3-4",

      // six
      "cell-3-5",
      "cell-4-5",
      "cell-5-5",

      // minute 4
      "corner-4",

      // minute 3
      "corner-3",
    ]);
  });
});
