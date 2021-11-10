let intervalNames = [
  "oclock",
  "five",
  "ten",
  "quarter",
  "twenty",
  "twentyfive",
  "half",
];

let attenuatedIndex = function (index) {
  // bounce off the end of intervalNames and go back up
  let arrayLen = intervalNames.length;
  if (index < arrayLen) {
    return index;
  } else {
    let diff = index - (arrayLen - 1);
    return index - diff * 2;
  }
};

let intervalNameForValue = function (value) {
  // retrieve e.g. "quarter" for 15 or 45
  let index = parseInt((value / 5) % 12);
  return intervalNames[attenuatedIndex(index)];
};

let minutesClasses = function (minutes) {
  // compose all the IDs for the minutes, e.g. [".a", ".quarter", ".past"]
  let principalInterval = intervalNameForValue(minutes);
  let output = [`.${principalInterval}`];

  if (minutes >= 35 && minutes < 60) {
    output.push(".to");
  } else if (minutes >= 5 && minutes <= 35) {
    output.push(".past");
  }

  return output;
};

let hoursClass = function (hours, minutes) {
  // get the Class for the hour e.g. ".h-3"
  if (minutes >= 35) {
    hours += 1;
  }

  return `.h-${hours % 12}`;
};

let classesToBeActivatedFor = function (time, language = "en") {
  // compile all the Classes for this particular time
  let intervals = minutesClasses(time.minutes);
  let hour = hoursClass(time.hours, time.minutes);

  let classes = selectItIs(time, language);

  // this is a stupid aesthetic choice
  if (intervals[0] == ".oclock") {
    classes = classes.concat(hour);
    classes = classes.concat(intervals);
  } else {
    classes = classes.concat(intervals);
    classes = classes.concat(hour);
  }

  classes = classes.concat(dotsForMinutes(time.minutes));

  return classes;
};

let dotsForMinutes = function (minutes) {
  // which dots to activate for these minutes
  let classes = [];
  for (let i = 0; i < minutes % 5; i++) {
    classes.push(`.m-${i + 1}`);
  }

  return classes;
};

let selectItIs = function (time, language) {
  /* eslint-disable indent */
  switch (language) {
    // Spanish rules
    case "es":
      switch (true) {
        case time.hours % 12 == 0 && time.minutes >= 35:
          return [".special-it", ".special-is"];

        case time.hours % 12 == 1:
          switch (true) {
            case time.minutes < 30:
              return [".special-it", ".special-is"];

            case time.minutes == 30:
              return [".it", ".special-is"];
          }
      }

    // eslint-disable no-fallthrough
    default:
      return [".it", ".is"];
  }
};

export {
  attenuatedIndex,
  dotsForMinutes,
  classesToBeActivatedFor,
  hoursClass,
  intervalNameForValue,
  minutesClasses,
  selectItIs,
};
