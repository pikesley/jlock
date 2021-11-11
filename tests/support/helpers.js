let fiveMinutes = function (start) {
  return Array.from({ length: 5 }, (x, i) => i + start);
};

let gatherSpanIDs = function (element) {
  let actives = [];
  let inactives = [];

  element.childNodes.forEach(function (child) {
    if (child.classList.contains("active")) {
      actives.push(child);
    }
    if (child.classList.contains("inactive")) {
      inactives.push(child);
    }
  });

  return {
    actives: actives.map((x) => x.id),
    inactives: inactives.map((x) => x.id),
  };
};

let ranges = {
  en: {
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
    to: ["cell-9-3", "cell-10-3"],
    six: ["cell-3-5", "cell-4-5", "cell-5-5"],
    seven: ["cell-0-8", "cell-1-8", "cell-2-8", "cell-3-8", "cell-4-8"],
  },
};

function combine(language, ...runs) {
  let list = [];
  runs.forEach(function (range) {
    list = list.concat(ranges["en"][range]);
  });

  return list;
}

export { fiveMinutes, gatherSpanIDs, combine };
