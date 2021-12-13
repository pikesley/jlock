import MockedSocket from "socket.io-mock";

import { run } from "modules/controls.js";
import { gatherSpanIDs, combine } from "./support/helpers.js";
import { en } from "./support/languages.js";

let interval = 10;
const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

let socket = new MockedSocket();

describe("Integration test", function () {
  it("displays the time", async function () {
    Date.now = jest.fn(() => Date.parse("2021-10-17T18:33"));

    let div = global.document.createElement("div");
    div.setAttribute("id", "test-clock");
    global.document.body.appendChild(div);

    let language = "en";
    run(socket, "#test-clock", interval, "TEST");

    socket.socketClient.emit("language", {
      language: language,
      data: en.data,
    });

    Date.now = jest.fn(() => Date.parse("2021-10-17T18:34"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(
      ".it .is .half .past .h-6 .m-1 .m-2 .m-3 .m-4"
    );

    let spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      ["corner-1", "corner-2"]
        .concat(combine(language, "it", "is", "half", "past", "six"))
        .concat(["corner-4", "corner-3"])
    );

    Date.now = jest.fn(() => Date.parse("2021-10-17T18:35"));
    await new Promise((r) => setTimeout(r, interval));
    expect(consoleLogMock).toBeCalledWith(".it .is .twentyfive .to .h-7");

    spans = gatherSpanIDs(div);
    expect(spans.actives).toEqual(
      combine(language, "it", "is", "twentyfive", "to", "seven")
    );

    expect(spans.inactives).toEqual(
      ["corner-1", "corner-2"]
        .concat(combine(language, "half", "past", "six"))
        .concat(["corner-4", "corner-3"])
    );
  });
});
