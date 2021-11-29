import { run } from "modules/controls.js";
import { gatherSpanIDs, combine } from "./support/helpers.js";

let interval = 10;
const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

jest.setTimeout(10000);
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: () => 500,
  })
);

let styles = global.document.createElement("link");
styles.setAttribute("id", "styles");
global.document.head.appendChild(styles);

describe("twentyfive bug", function () {
  it("activates and deactivates multi-class spans correctly", async function () {
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:20"));

    let div = global.document.createElement("div");
    div.setAttribute("id", "test-clock");
    global.document.body.appendChild(div);

    let language = "en";
    run("#test-clock", "en", interval);

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:20"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twenty .past .h-6");

    let spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine(language, "it", "is", "twenty", "past", "six")
    );

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:25"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twentyfive .past .h-6");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine(language, "it", "is", "twentyfive", "past", "six")
    );
    expect(spans.inactives).toEqual([]);

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:30"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .half .past .h-6");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine(language, "it", "is", "half", "past", "six")
    );

    expect(spans.inactives).toEqual(combine(language, "twentyfive"));

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:35"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twentyfive .to .h-7");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine(language, "it", "is", "twentyfive", "to", "seven")
    );
    expect(spans.inactives).toEqual(combine(language, "half", "past", "six"));

    //
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:40"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twenty .to .h-7");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine(language, "it", "is", "twenty", "to", "seven")
    );
    expect(spans.inactives).toEqual(
      combine(language, "five", "half", "past", "six")
    );

    Date.now = jest.fn(() => Date.parse("2021-10-17T18:45"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .quarter .to .h-7");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine(language, "it", "is", "quarter", "to", "seven")
    );

    expect(spans.inactives).toEqual(
      combine(language, "twenty", "five", "half", "past", "six")
    );
  });
});
