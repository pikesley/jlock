import { run } from "modules/controls.js";
import { gatherSpanIDs } from "./support/helpers.js";
let interval = 10;
const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
// jest.setTimeout(20000);

describe("twentyfive bug", function () {
  it("activates and deactivates multi-class spans correctly", async function () {
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:20"));

    let div = global.document.createElement("div");
    div.setAttribute("id", "test-clock");
    global.document.body.appendChild(div);
    run("#test-clock", "en", interval);

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:20"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twenty .past .h-6");

    let spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(combine("it", "is", "twenty", "past", "six"));

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:25"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twentyfive .past .h-6");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine("it", "is", "twentyfive", "past", "six")
    );
    expect(spans.inactives).toEqual([]);

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:30"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .half .past .h-6");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(combine("it", "is", "half", "past", "six"));

    expect(spans.inactives).toEqual(combine("twentyfive"));

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:35"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twentyfive .to .h-7");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine("it", "is", "twentyfive", "to", "seven")
    );
    expect(spans.inactives).toEqual(combine("half", "past", "six"));

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:40"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twenty .to .h-7");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(combine("it", "is", "twenty", "to", "seven"));
    expect(spans.inactives).toEqual(combine("five", "half", "past", "six"));

    Date.now = jest.fn(() => Date.parse("2021-10-17T18:45"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .quarter .to .h-7");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine("it", "is", "quarter", "to", "seven")
    );

    expect(spans.inactives).toEqual(
      combine("twenty", "five", "half", "past", "six")
    );
  });
});

let ranges = {
  it: ["cell-0-0", "cell-1-0"],
  is: ["cell-3-0", "cell-4-0"],
  five: ["cell-6-2", "cell-7-2", "cell-8-2", "cell-9-2"],
  quarter: [
    "cell-0-1",
    "cell-2-1",
    "cell-3-1",
    "cell-4-1",
    "cell-5-1",
    "cell-6-1",
    "cell-7-1",
    "cell-8-1",
  ],
  twenty: [
    "cell-0-2",
    "cell-1-2",
    "cell-2-2",
    "cell-3-2",
    "cell-4-2",
    "cell-5-2",
  ],
  twentyfive: [
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
  ],
  half: ["cell-0-3", "cell-1-3", "cell-2-3", "cell-3-3"],

  past: ["cell-0-4", "cell-1-4", "cell-2-4", "cell-3-4"],
  to: ["cell-10-3", "cell-11-3"],
  six: ["cell-3-5", "cell-4-5", "cell-5-5"],
  seven: ["cell-0-8", "cell-1-8", "cell-2-8", "cell-3-8", "cell-4-8"],
};

function combine(...runs) {
  let list = [];
  runs.forEach(function (range) {
    list = list.concat(ranges[range]);
  });

  return list;
}
