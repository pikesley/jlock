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

let getTime = function () {
  // retrieve the current hours and minutes
  let current = new Date();
  let hours = current.getHours();
  let minutes = current.getMinutes();

  // so we can test without selenium fuckery
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("faketime")) {
    faketime = urlParams.get('faketime').split(":");
    hours = faketime[0];
    minutes = faketime[1];
  }

  return { hours: parseInt(hours), minutes: parseInt(minutes) };
};

let intervalNameForValue = function (value) {
  // retrieve e.g. "quarter" for 15 or 45
  let index = parseInt((value / 5) % 12);
  return intervalNames[attenuatedIndex(index)];
};

let minutesClasses = function (minutes) {
  // compose all the ID the minutes, e.g. [".a", ".quarter", ".past"]
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

let ClassesToBeActivatedFor = function (time) {
  // compile all the Classes for this particular time
  intervals = minutesClasses(time.minutes);
  hour = hoursClass(time.hours, time.minutes);

  classes = [".it", ".is"];

  // this is a stupid aesthetic choice
  if (intervals[0] == ".oclock") {
    classes = classes.concat(hour);
    classes = classes.concat(intervals);
  } else {
    classes = classes.concat(intervals);
    classes = classes.concat(hour);
  }

  classes = classes.concat(dotsForMinutes(time.minutes))

  return classes;
};

let dotsForMinutes = function (minutes) {
  classes = []
  for(i = 0; i < minutes % 5; i++) {
    classes.push(`.m-${i + 1}`)
  }

  return classes
}
