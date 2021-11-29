import { SpanManager } from "./spanManager.js";
import { TimeFinder } from "./timeFinder.js";
import { populateClock } from "./populate.js";
import { classesToBeActivatedFor } from "./jlock.js";
import { conf } from "../conf.js";
import { DimensionFinder } from "./dimensionFinder.js";
import * as languages from "../internationalisation/index.js";

var currents = {
  style: null,
  language: null,
};

let screen = document.createElement("div");
screen.classList.add("screen");
document.querySelector("html").appendChild(screen);

// we can override `interval` to speed up our tests
let run = function (element = "#clock", interval = 1000) {
  reveal();
  setInterval(function () {
    refreshContent(element);
    refreshClock();
  }, interval);
};

let refreshContent = function (element) {
  fetch("/controller/style")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      setStyle(json.style);
    })
    .catch(function () {
      // we couldn't talk to the backend
      setStyle(fromQueryString("style"));
    });

  fetch("/controller/language")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      repopulate(element, json.language);
    })
    .catch(function () {
      // we couldn't talk to the backend
      repopulate(element, fromQueryString("language"));
    });
};

let refreshClock = function () {
  // update the time
  let sm = new SpanManager(
    JSON.parse(localStorage["active-classes"] || "[]"),
    classesToBeActivatedFor(new TimeFinder(), currents.language)
  );

  sm.yeet();
};

let repopulate = function (element, language) {
  if (language != currents.language) {
    hideChangeReveal(function () {
      let el = document.querySelector(element);
      let dimensions = new DimensionFinder(languages[language]["data"]);
      let dimensionedClockClass = `clock-grid-${dimensions.columns}-${dimensions.rows}`;

      // reset classes
      el.className = "";
      el.classList.add("clock-grid");
      el.classList.add(dimensionedClockClass);

      populateClock(element, languages[language]["data"], dimensions);

      // force a refresh
      localStorage["active-classes"] = null;
      refreshClock();

      currents.language = language;
    });
  }
};

let setStyle = function (style) {
  if (style != currents.style) {
    hideChangeReveal(function () {
      document
        .querySelector("#styles")
        .setAttribute("href", `css/clocks/${style}.css`);

      currents.style = style;
    });
  }
};

// https://stackoverflow.com/a/56104627
let hideChangeReveal = function (callback) {
  screen.classList.remove("reveal");
  screen.classList.add("hide");

  screen.addEventListener("transitionend", function x() {
    // this seems redundant but is VERY IMPORTANT
    screen.removeEventListener("transitionend", x);

    callback();

    reveal();
  });
};

let reveal = function () {
  screen.classList.remove("hide");
  screen.classList.add("reveal");
};

let fromQueryString = function (param) {
  let parameter = conf.defaults[param];
  let params = new URLSearchParams(window.location.search);
  if (params.get(param)) {
    parameter = params.get(param);
  }

  return parameter;
};

export { run };
