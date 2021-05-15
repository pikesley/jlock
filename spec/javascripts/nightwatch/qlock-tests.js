const timeout = 10;
const url = "http://qlock";

let spanClasses = [
  ".it",
  ".is",
  ".a",
  ".five",
  ".ten",
  ".quarter",
  ".twenty",
  ".half",
  ".past",
  ".to",
  ".oclock",
  ".h-0",
  ".h-1",
  ".h-2",
  ".h-3",
  ".h-4",
  ".h-5",
  ".h-6",
  ".h-7",
  ".h-8",
  ".h-9",
  ".h-10",
  ".h-11",
  ".m-1",
  ".m-2",
  ".m-3",
  ".m-4",
];

module.exports = {
  "The clock has the correct content": function (browser) {
    browser
      .url(url)
      .waitForElementVisible("body", timeout)
      .verify.containsText("#clock", "·")
      .verify.containsText("#clock", "I\nT\nL\nI\nS\nA\nS\nA\nM\nP\nM")
      .verify.containsText("#clock", "A\nC\nQ\nU\nA\nR\nT\nE\nR\nD\nC")
      .verify.containsText("#clock", "T\nW\nE\nN\nT\nY\nF\nI\nV\nE\nX")
      .verify.containsText("#clock", "H\nA\nL\nF\nS\nT\nE\nN\nF\nT\nO")
      .verify.containsText("#clock", "P\nA\nS\nT\nE\nR\nU\nN\nI\nN\nE")
      .verify.containsText("#clock", "O\nN\nE\nS\nI\nX\nT\nH\nR\nE\nE")
      .verify.containsText("#clock", "F\nO\nU\nR\nF\nI\nV\nE\nT\nW\nO")
      .verify.containsText("#clock", "E\nI\nG\nH\nT\nE\nL\nE\nV\nE\nN")
      .verify.containsText("#clock", "S\nE\nV\nE\nN\nT\nW\nE\nL\nV\nE")
      .verify.containsText("#clock", "T\nE\nN\nS\nE\nO\nC\nL\nO\nC\nK");
  },

    // "The correct spans are activated": function (browser) {
    //   [
    //     {
    //       timestamp: "12:00",
    //       spans: [".it", ".is", ".h-0", ".oclock"],
    //     },
    //     // {
    //     //   timestamp: "17:46",
    //     //   spans: ["#it", "#is", "#a", "#quarter", "#to", "#h-6", "#m-1"],
    //     // },
    //     // {
    //     //   timestamp: "03:27",
    //     //   spans: ["#it", "#is", "#twenty", "#five", "#past", "#h-3", "#m-1", "#m-2"],
    //     // },
    //     // {
    //     //   timestamp: "20:35",
    //     //   spans: ["#it", "#is", "#twenty", "#five", "#to", "#h-9"],
    //     // },
    //   ].forEach(function (expectation) {
    //     analyseSpans(expectation.timestamp, expectation.spans, browser);
    //   });
    // },

    "It correctly populates localStorage": function (browser) {
      let timestamp = "19:26";

      // https://stackoverflow.com/a/41969326
      browser.url(`${url}?faketime=${timestamp}`).execute(
        () => Object.assign({}, localStorage),
        [],
        function (result) {
          browser
            .expect(result.value["active-classes"])
            .to.equal('[".it",".is",".twenty",".five",".past",".h-7",".m-1"]');
        }
      );
    },
};

let analyseSpans = function (timestamp, spans, browser) {
  antiSpans = invertSpans(spans);

  // this obvious witchcraft due to Tom Spurling https://twitter.com/tsprlng/status/1388597370682740736?s=20
  spans.reduce(
    (browser, span) =>
      browser
        // .waitForElementVisible(span, timeout)
        .assert.cssClassPresent(span, "active"),
    browser.url(`${url}?faketime=${timestamp}`)
  );

  antiSpans.reduce(
    (browser, span) =>
      browser
        .waitForElementVisible(span, timeout)
        .assert.not.cssClassPresent(span, "active"),
    browser.url(`${url}?faketime=${timestamp}`)
  );
};

let invertSpans = function (spans) {
  invertedSpans = [];
  spanClasses.forEach(function (span) {
    if (!spans.includes(span)) {
      invertedSpans.push(span);
    }
  });

  return invertedSpans;
};
