describe("attenuatedIndex", function () {
  it("generates indeces to traverse the intervalNames backwards", function () {
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 5],
      [8, 4],
      [9, 3],
      [10, 2],
      [11, 1],
    ].forEach(function (pair) {
      expect(attenuatedIndex(pair[0])).toEqual(pair[1]);
    });
  });
});

describe("intervalNameForValue", function () {
  it("returns 'oclock'", function () {
    [58, 59, 00, 01, 02].forEach(function (minutes) {
      expect(intervalNameForValue(minutes)).toEqual("oclock");
    });
  });

  it("returns 'five' for 'past'", function () {
    [03, 04, 05, 06, 07].forEach(function (minutes) {
      expect(intervalNameForValue(minutes)).toEqual("five");
    });
  });

  it("returns 'ten' for 'past'", function () {
    expect(intervalNameForValue(10)).toEqual("ten");
  });

  it("returns 'half'", function () {
    expect(intervalNameForValue(30)).toEqual("half");
  });

  it("returns 'quarter' for 'to'", function () {
    expect(intervalNameForValue(45)).toEqual("quarter");
  });
});

describe("minutesIDs", function () {
  expectations = [
    {
      minutes: [58, 59, 00, 01, 02],
      ids: ["#oclock"],
    },
    {
      minutes: [03, 04, 05, 06, 07],
      ids: ["#five", "#past"],
    },
    {
      minutes: [08, 09, 10, 11, 12],
      ids: ["#ten", "#past"],
    },
    {
      minutes: [13, 14, 15, 16, 17],
      ids: ["#a", "#quarter", "#past"],
    },
    {
      minutes: [18, 19, 20, 21, 22],
      ids: ["#twenty", "#past"],
    },
    {
      minutes: [23, 24, 25, 26, 27],
      ids: ["#twenty", "#five", "#past"],
    },
    {
      minutes: [28, 29, 30, 31, 32],
      ids: ["#half", "#past"],
    },
    {
      minutes: [33, 34, 35, 36, 37],
      ids: ["#twenty", "#five", "#to"],
    },
    {
      minutes: [38, 39, 40, 41, 42],
      ids: ["#twenty", "#to"],
    },
    {
      minutes: [43, 44, 45, 46, 47],
      ids: ["#a", "#quarter", "#to"],
    },
    {
      minutes: [48, 49, 50, 51, 52],
      ids: ["#ten", "#to"],
    },
    {
      minutes: [53, 54, 55, 56, 57],
      ids: ["#five", "#to"],
    },
  ];

  expectations.forEach(function (expectation) {
    it(`returns ${expectation.ids}`, function () {
      expectation.minutes.forEach(function (minute) {
        expect(minutesIDs(minute)).toEqual(expectation.ids);
      });
    });
  });
});

describe("hoursID", function () {
  expectations = [
    {
      result: "#h-1",
      times: [
        [1, 0],
        [13, 0],
        [12, 59],
        [0, 59],
        [12, 34],
        [0, 34],
        [12, 33],
      ],
    },
    {
      result: "#h-6",
      times: [
        [6, 0],
        [18, 0],
        [17, 58],
        [5, 59],
        [17, 33],
        [5, 34],
      ],
    },
    {
      result: "#h-0",
      times: [
        [0, 0],
        [12, 0],
        [12, 25],
        [11, 59],
        [23, 59],
        [11, 34],
        [23, 34],
      ],
    },
  ];

  expectations.forEach(function (expectation) {
    it(`returns ${expectation.result}`, function () {
      expectation.times.forEach(function (time) {
        expect(hoursID(time[0], time[1])).toEqual(expectation.result);
      });
    });
  });
});

describe("IDsToBeActivatedFor", function () {
  it("compiles the ID which should be activated", function () {
    expect(IDsToBeActivatedFor({ hours: 12, minutes: 30 })).toEqual([
      "#it",
      "#is",
      "#half",
      "#past",
      "#h-0",
    ]);
    expect(IDsToBeActivatedFor({ hours: 15, minutes: 45 })).toEqual([
      "#it",
      "#is",
      "#a",
      "#quarter",
      "#to",
      "#h-4",
    ]);
    expect(IDsToBeActivatedFor({ hours: 03, minutes: 57 })).toEqual([
      "#it",
      "#is",
      "#five",
      "#to",
      "#h-4",
    ]);
    expect(IDsToBeActivatedFor({ hours: 03, minutes: 58 })).toEqual([
      "#it",
      "#is",
      "#h-4",
      "#oclock",
    ]);
    expect(IDsToBeActivatedFor({ hours: 03, minutes: 33 })).toEqual([
      "#it",
      "#is",
      "#twenty",
      "#five",
      "#to",
      "#h-4",
    ]);
  });

  it("correctly compiles the intervals around the top of the hour", function () {
    expect(IDsToBeActivatedFor({ hours: 06, minutes: 57 })).toEqual([
      "#it",
      "#is",
      "#five",
      "#to",
      "#h-7",
    ]);
    [58, 59].forEach(function (minutes) {
      expect(IDsToBeActivatedFor({ hours: 06, minutes: minutes })).toEqual([
        "#it",
        "#is",
        "#h-7",
        "#oclock",
      ]);
    });
    [00, 01, 02].forEach(function (minutes) {
      expect(IDsToBeActivatedFor({ hours: 07, minutes: minutes })).toEqual([
        "#it",
        "#is",
        "#h-7",
        "#oclock",
      ]);
    });
    expect(IDsToBeActivatedFor({ hours: 07, minutes: 03 })).toEqual([
      "#it",
      "#is",
      "#five",
      "#past",
      "#h-7",
    ]);
  });

  it("correctly compiles the intervals around the half-hour", function () {
    expect(IDsToBeActivatedFor({ hours: 12, minutes: 27 })).toEqual([
      "#it",
      "#is",
      "#twenty",
      "#five",
      "#past",
      "#h-0",
    ]);
    [28, 29, 30, 31, 32].forEach(function (minutes) {
      expect(IDsToBeActivatedFor({ hours: 12, minutes: minutes })).toEqual([
        "#it",
        "#is",
        "#half",
        "#past",
        "#h-0",
      ]);
    });
    expect(IDsToBeActivatedFor({ hours: 12, minutes: 33 })).toEqual([
      "#it",
      "#is",
      "#twenty",
      "#five",
      "#to",
      "#h-1",
    ]);
  });
});
