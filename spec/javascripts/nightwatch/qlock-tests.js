const timeout = 10;
const url = "http://qlock";

spanIDs = [
  "#it",
  "#is",
  "#a",
  "#five",
  "#ten",
  "#quarter",
  "#twenty",
  "#half",
  "#past",
  "#to",
  "#oclock",
  "#h-0",
  "#h-1",
  "#h-2",
  "#h-3",
  "#h-4",
  "#h-5",
  "#h-6",
  "#h-7",
  "#h-8",
  "#h-9",
  "#h-10",
  "#h-11",
  "#m-1",
  "#m-2",
  "#m-3",
  "#m-4",
];

module.exports = {
  "The clock has the correct content": function (browser) {
    browser
      .url(url)
      .waitForElementVisible("body", timeout)
      .verify.containsText("#clock", "·           ·")
      .verify.containsText("#clock", " ITLISASAMPM ")
      .verify.containsText("#clock", " ACQUARTERDC ")
      .verify.containsText("#clock", " TWENTYFIVEX ")
      .verify.containsText("#clock", " HALFSTENFTO ")
      .verify.containsText("#clock", " PASTERUNINE ")
      .verify.containsText("#clock", " ONESIXTHREE ")
      .verify.containsText("#clock", " FOURFIVETWO ")
      .verify.containsText("#clock", " EIGHTELEVEN ")
      .verify.containsText("#clock", " SEVENTWELVE ")
      .verify.containsText("#clock", " TENSEOCLOCK ")
      .verify.containsText("#clock", "·           ·");
  },

  "The spans have the correct content": function (browser) {
    browser
      .url(url)
      .waitForElementVisible("body", timeout)
      .verify.containsText("#it", "IT")
      .verify.containsText("#quarter", "QUARTER")
      .verify.containsText("#h-3", "THREE")
      .verify.containsText("#h-9", "NINE")
      .verify.containsText("#h-0", "TWELVE")
      .verify.containsText("#oclock", "OCLOCK");
  },

  "The correct spans are activated": function (browser) {
    [
      {
        timestamp: "12:00",
        spans: ["#it", "#is", "#h-0", "#oclock"],
      },
      {
        timestamp: "17:46",
        spans: ["#it", "#is", "#a", "#quarter", "#to", "#h-6", "#m-1"],
      },
      {
        timestamp: "03:27",
        spans: ["#it", "#is", "#twenty", "#five", "#past", "#h-3", "#m-1", "#m-2"],
      },
      {
        timestamp: "20:35",
        spans: ["#it", "#is", "#twenty", "#five", "#to", "#h-9"],
      },
    ].forEach(function (expectation) {
      analyseSpans(expectation.timestamp, expectation.spans, browser);
    });
  },

  "It correctly populates localStorage": function (browser) {
    let timestamp = "19:26";

    // https://stackoverflow.com/a/41969326
    browser.url(`${url}?faketime=${timestamp}`).execute(
      () => Object.assign({}, localStorage),
      [],
      function (result) {
        browser
          .expect(result.value["active-ids"])
          .to.equal('["#it","#is","#twenty","#five","#past","#h-7","#m-1"]');
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
        .waitForElementVisible(span, timeout)
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
  spanIDs.forEach(function (span) {
    if (!spans.includes(span)) {
      invertedSpans.push(span);
    }
  });

  return invertedSpans;
};
