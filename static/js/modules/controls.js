import { SpanManager } from "./spanManager.js";
import { TimeFinder } from "./timeFinder.js";
import { populateClock } from "./populate.js";
import { classesToBeActivatedFor } from "./jlock.js";
import { conf } from "../conf.js";

var validStyles = [];
var html = document.querySelector("html");

let initialise = function (element = "#clock") {
  fadeIn();

  let params = urlParams();

  if (params) {
    runServerLess(params, element);
  } else {
    // this will not work in jest
    try {
      fetch("/controller/style")
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          let style = json.style;
          // let element = document.querySelector("#styles");
          document
            .querySelector("#styles")
            .setAttribute("href", `css/clocks/${style}.css`);
        });
    } catch (ReferenceError) {
      // but I don't really care
      null;
    }

    try {
      fetch("/controller/language")
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          run(element, json.language);
        });
    } catch (ReferenceError) {
      null;
    }
  }
};

let run = function (element, language) {
  populateClock(element, language);

  // force it to update on the first load
  localStorage["active-classes"] = null;
  refreshClock();

  // check for updates every second
  setInterval(refreshClock, 1000);
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

function urlParams() {
  let count = 0;
  let params = new URLSearchParams(window.location.search);
  params.forEach(function (key, value) {
    count += 1;
  });

  if (count > 0) {
    return params;
  }

  return false;
}

// run where we don't have a backend (netlify, for example)
function runServerLess(params, element) {
  let language = "en";
  let style = "blue-orange";

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

export { initialise, run };
