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

  if (principalInterval == "twentyfive") {
    output = [".twenty", ".five"];
  }

  if (principalInterval == "quarter") {
    output.unshift(".a");
  }

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

let classesToBeActivatedFor = function (time) {
  // compile all the Classes for this particular time
  let intervals = minutesClasses(time.minutes);
  let hour = hoursClass(time.hours, time.minutes);

  let classes = [".it", ".is"];

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
  let classes = [];
  for (let i = 0; i < minutes % 5; i++) {
    classes.push(`.m-${i + 1}`);
  }

  return classes;
};

export {
  attenuatedIndex,
  dotsForMinutes,
  classesToBeActivatedFor,
  hoursClass,
  intervalNameForValue,
  minutesClasses,
};