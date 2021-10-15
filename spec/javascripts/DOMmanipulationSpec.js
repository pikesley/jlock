describe("DOM manipulation", function () {
  beforeEach(function () {
    let div = document.createElement("div");
    div.setAttribute("id", "test-clock");
    document.body.append(div);
    populateClock("#test-clock");
  });

  afterEach(function () {
    let div = document.querySelector("#test-clock");
    div.remove();
  });

  it("starts with a clean slate", function () {
    let actives = [];
    let div = document.querySelector("#test-clock");

    div.childNodes.forEach(function (child) {
      if (child.classList.contains("active")) {
        actives.push(child);
      }
    });

    expect(actives.length).toEqual(0);
  });

  it("activates the correct spans", function () {
    sm = new SpanManager([], [".it"]);
    sm.yeet();

    let actives = [];
    let div = document.querySelector("#test-clock");

    div.childNodes.forEach(function (child) {
      if (child.classList.contains("active")) {
        actives.push(child);
      }
    });

    expect(actives.map((x) => x.getAttribute("id"))).toEqual([
      "cell-0-0",
      "cell-1-0",
    ]);
  });

  it("yeets the correct spans", function () {
    sm = new SpanManager([], [".it", ".is", ".h-0", ".oclock"]);
    sm.yeet();

    sm = new SpanManager(
      [".it", ".is", ".h-0", ".oclock"],
      [".it", ".is", ".half", ".past", ".h-2", ".m-1"]
    );
    sm.yeet();

    let actives = [];
    let inactives = [];

    let div = document.querySelector("#test-clock");

    div.childNodes.forEach(function (child) {
      if (child.getAttribute("class")) {
        if (child.classList.contains("active")) {
          actives.push(child);
        }
        if (child.classList.contains("inactive")) {
          inactives.push(child);
        }
      }
    });

    expect(actives.map((x) => x.getAttribute("id"))).toEqual([
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

    expect(inactives.map((x) => x.getAttribute("id"))).toEqual([
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
