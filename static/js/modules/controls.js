import { SpanManager } from "./spanManager.js";
import { TimeFinder } from "./timeFinder.js";
import { populateClock } from "./populate.js";
import { classesToBeActivatedFor } from "./jlock.js";
import { conf } from "../conf.js";

var html = document.querySelector("html");

let initialise = function (element = "#clock") {
  // see if the backend is reachable
  fetch("/controller/")
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(function () {
      runWithBackend(element);
    })
    .catch(function () {
      runServerLess(element);
    });
};

let runWithBackend = function (element) {
  fetch("/controller/style")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      let style = json.style;
      document
        .querySelector("#styles")
        .setAttribute("href", `css/clocks/${style}.css`);
    });

  fetch("/controller/language")
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(function (response) {
      return response.json;
    })
    .then(function (json) {
      run(element, json.language);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// run where we don't have a backend (netlify, for example)
function runServerLess(element) {
  let style = conf.defaults.style;
  let language = conf.defaults.language;

  let params = new URLSearchParams(window.location.search);
  if (params.get("style")) {
    style = params.get("style");
  }

  if (params.get("language")) {
    language = params.get("language");
  }

  document
    .querySelector("#styles")
    .setAttribute("href", `css/clocks/${style}.css`);

  run(element, language);
}

// we can override `interval` to speed up our tests
let run = function (element, language, interval = 1000) {
  fadeIn();

  populateClock(element, language);

  // force it to update on the first load
  localStorage["active-classes"] = null;
  refreshClock();

  // check for updates every second
  setInterval(refreshClock, interval);
};

let refreshClock = function () {
  // update the clock
  let sm = new SpanManager(
    JSON.parse(localStorage["active-classes"] || "[]"),
    classesToBeActivatedFor(new TimeFinder())
  );

  sm.yeet();
};

function fadeIn() {
  html.style.opacity = 0;

  (function fade() {
    var val = parseFloat(html.style.opacity);
    if (!((val += conf.fadeIncrement) > 1)) {
      html.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

export { initialise, run };
