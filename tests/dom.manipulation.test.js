import { populateClock } from "modules/populate.js";
import { SpanManager } from "modules/spanManager.js";
import { gatherSpanIDs } from "./support/helpers.js";

const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

let div = null;

describe("DOM manipulation", function () {
  beforeEach(function () {
    div = global.document.createElement("div");
    div.setAttribute("id", "test-clock");
    global.document.body.appendChild(div);
    populateClock("#test-clock");
  });

  afterEach(function () {
    div.remove();
    div = null;
  });

  it("starts with a clean slate", function () {
    let spans = gatherSpanIDs(div);

    expect(spans.actives.length).toEqual(0);
  });

  it("activates the correct spans", function () {
    let sm = new SpanManager([], [".it"]);
    sm.yeet();
    let spans = gatherSpanIDs(div);

    expect(spans.actives).toEqual(["cell-0-0", "cell-1-0"]);
  });

  it("yeets the correct spans", function () {
    let sm = new SpanManager([], [".it", ".is", ".h-0", ".oclock"]);
    sm.yeet();
    sm = new SpanManager(
      [".it", ".is", ".h-0", ".oclock"],
      [".it", ".is", ".half", ".past", ".h-2", ".m-1"]
    );
    sm.yeet();

    expect(consoleLogMock).toBeCalledWith(".it .is .half .past .h-2 .m-1");

    let spans = gatherSpanIDs(div);

    expect(spans.actives).toEqual([
      // 1 minute
      "corner-1",
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
      // two
      "cell-8-6",
      "cell-9-6",
      "cell-10-6",
    ]);
    expect(spans.inactives).toEqual([
      // twelve
      "cell-5-8",
      "cell-6-8",
      "cell-7-8",
      "cell-8-8",
      "cell-9-8",
      "cell-10-8",
      // oclock
      "cell-5-9",
      "cell-6-9",
      "cell-7-9",
      "cell-8-9",
      "cell-9-9",
      "cell-10-9",
    ]);
  });
});
