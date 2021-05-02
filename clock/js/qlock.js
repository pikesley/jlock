let intervalNames = [
  "oclock",
  "five",
  "ten",
  "quarter",
  "twenty",
  "twentyfive",
  "half",
];

let leeway = 2; // minutes ahead of the actual time that we change the clock

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
  let index = parseInt(((value + leeway) / 5) % 12);
  return intervalNames[attenuatedIndex(index)];
};

let minutesIDs = function (minutes) {
  // compose all the ID the minutes, e.g. ["#a", "#quarter", "#past"]
  let principalInterval = intervalNameForValue(minutes);
  let output = [`#${principalInterval}`];

  if (principalInterval == "twentyfive") {
    output = ["#twenty", "#five"];
  }

  if (principalInterval == "quarter") {
    output.unshift("#a");
  }

  if (minutes >= 35 - leeway && minutes < 60 - leeway) {
    output.push("#to");
  } else if (minutes >= 5 - leeway && minutes <= 35 - leeway) {
    output.push("#past");
  }

  return output;
};

let hoursID = function (hours, minutes) {
  // get the ID for the hour e.g. "#h-3"
  if (minutes >= 35 - leeway) {
    hours += 1;
  }

  return `#h-${hours % 12}`;
};

let IDsToBeActivatedFor = function (time) {
  // compile all the IDs for this particular time
  intervals = minutesIDs(time.minutes);
  hour = hoursID(time.hours, time.minutes);

  ids = ["#it", "#is"];

  // this is a stupid aesthetic choice
  if (intervals[0] == "#oclock") {
    ids = ids.concat(hour);
    ids = ids.concat(intervals);
  } else {
    ids = ids.concat(intervals);
    ids = ids.concat(hour);
  }

  return ids;
};
