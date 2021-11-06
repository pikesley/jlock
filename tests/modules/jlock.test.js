import {
  attenuatedIndex,
  classesToBeActivatedFor,
  dotsForMinutes,
  hoursClass,
  intervalNameForValue,
  minutesClasses,
} from "modules/jlock.js";
import { fiveMinutes } from "support/helpers.js";

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
    fiveMinutes(0).forEach(function (minutes) {
      expect(intervalNameForValue(minutes)).toEqual("oclock");
    });
  });

  it("returns 'five' for 'past'", function () {
    fiveMinutes(5).forEach(function (minutes) {
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

describe("minutesClasses", function () {
  let expectations = [
    {
      minutes: fiveMinutes(0),
      ids: [".oclock"],
    },
    {
      minutes: fiveMinutes(5),
      ids: [".five", ".past"],
    },
    {
      minutes: fiveMinutes(10),
      ids: [".ten", ".past"],
    },
    {
      minutes: fiveMinutes(15),
      ids: [".quarter", ".past"],
    },
    {
      minutes: fiveMinutes(20),
      ids: [".twenty", ".past"],
    },
    {
      minutes: fiveMinutes(25),
      ids: [".twentyfive", ".past"],
    },
    {
      minutes: fiveMinutes(30),
      ids: [".half", ".past"],
    },
    {
      minutes: fiveMinutes(35),
      ids: [".twentyfive", ".to"],
    },
    {
      minutes: fiveMinutes(40),
      ids: [".twenty", ".to"],
    },
    {
      minutes: fiveMinutes(45),
      ids: [".quarter", ".to"],
    },
    {
      minutes: fiveMinutes(50),
      ids: [".ten", ".to"],
    },
    {
      minutes: fiveMinutes(55),
      ids: [".five", ".to"],
    },
  ];

  expectations.forEach(function (expectation) {
    it(`returns ${expectation.ids}`, function () {
      expectation.minutes.forEach(function (minute) {
        expect(minutesClasses(minute)).toEqual(expectation.ids);
      });
    });
  });
});

describe("dotsForMinutes", function () {
  it("returns `m-1` for 1 minute past", function () {
    expect(dotsForMinutes(1)).toEqual([".m-1"]);
  });
  it("returns `m-1/2/3` for 3 minutes past", function () {
    expect(dotsForMinutes(3)).toEqual([".m-1", ".m-2", ".m-3"]);
  });
  it("returns `m-1/2` for 22 minutes past", function () {
    expect(dotsForMinutes(22)).toEqual([".m-1", ".m-2"]);
  });
  it("returns `m-1/2/3/4` for 39 minutes past", function () {
    expect(dotsForMinutes(39)).toEqual([".m-1", ".m-2", ".m-3", ".m-4"]);
  });
});

describe("hoursClass", function () {
  let expectations = [
    {
      result: ".h-1",
      times: [
        [1, 0],
        [13, 0],
        [12, 59],
        [0, 59],
        [12, 35],
        [0, 35],
        [12, 36],
      ],
    },
    {
      result: ".h-6",
      times: [
        [6, 0],
        [18, 0],
        [17, 58],
        [5, 59],
        [17, 35],
        [5, 36],
      ],
    },
    {
      result: ".h-0",
      times: [
        [0, 0],
        [12, 0],
        [12, 25],
        [11, 59],
        [23, 59],
        [11, 35],
        [23, 36],
      ],
    },
  ];

  expectations.forEach(function (expectation) {
    it(`returns ${expectation.result}`, function () {
      expectation.times.forEach(function (time) {
        expect(hoursClass(time[0], time[1])).toEqual(expectation.result);
      });
    });
  });
});

describe("classesToBeActivatedFor", function () {
  it("compiles the classes which should be activated", function () {
    expect(classesToBeActivatedFor({ hours: 12, minutes: 30 })).toEqual([
      ".it",
      ".is",
      ".half",
      ".past",
      ".h-0",
    ]);
    expect(classesToBeActivatedFor({ hours: 15, minutes: 45 })).toEqual([
      ".it",
      ".is",
      ".quarter",
      ".to",
      ".h-4",
    ]);
    expect(classesToBeActivatedFor({ hours: 3, minutes: 57 })).toEqual([
      ".it",
      ".is",
      ".five",
      ".to",
      ".h-4",
      ".m-1",
      ".m-2",
    ]);
    expect(classesToBeActivatedFor({ hours: 4, minutes: 0 })).toEqual([
      ".it",
      ".is",
      ".h-4",
      ".oclock",
    ]);
    expect(classesToBeActivatedFor({ hours: 3, minutes: 35 })).toEqual([
      ".it",
      ".is",
      ".twentyfive",
      ".to",
      ".h-4",
    ]);
  });

  it("correctly compiles the intervals around the top of the hour", function () {
    expect(classesToBeActivatedFor({ hours: 6, minutes: 57 })).toEqual([
      ".it",
      ".is",
      ".five",
      ".to",
      ".h-7",
      ".m-1",
      ".m-2",
    ]);

    expect(classesToBeActivatedFor({ hours: 7, minutes: 5 })).toEqual([
      ".it",
      ".is",
      ".five",
      ".past",
      ".h-7",
    ]);
  });

  it("correctly compiles the intervals around the half-hour", function () {
    expect(classesToBeActivatedFor({ hours: 12, minutes: 27 })).toEqual([
      ".it",
      ".is",
      ".twentyfive",
      ".past",
      ".h-0",
      ".m-1",
      ".m-2",
    ]);

    expect(classesToBeActivatedFor({ hours: 12, minutes: 35 })).toEqual([
      ".it",
      ".is",
      ".twentyfive",
      ".to",
      ".h-1",
    ]);
  });
});
