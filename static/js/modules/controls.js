import { SpanManager } from "./spanManager.js";
import { TimeFinder } from "./timeFinder.js";
import { populateClock } from "./populate.js";
import { classesToBeActivatedFor } from "./jlock.js";
import { conf } from "../conf.js";

var validStyles = [];
var html = document.querySelector("html");

let initialise = function (element = "#clock") {
  fadeIn();

  // this will not work in jest
  try {
    fetch("/css/clocks/")
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.forEach(function (entry) {
          if (entry.name.endsWith("css")) {
            validStyles.push(entry.name.replace(/\.[^/.]+$/, ""));
          }
        });
        setStyles();
      })
      .catch(function () {
        setStyles("01-offset");
      });
  } catch (ReferenceError) {
    // but I don't really care
    null;
  }

  populateClock(element);

  // force it to update on the first load
  localStorage["active-classes"] = null;
  refreshClock();

  // check for updates every second
  setInterval(refreshClock, 1000);

  // call cycleStyle when we get a click anywhere
  document.addEventListener("click", function () {
    cycleStyle();
  });
};

let refreshClock = function () {
  // update the clock
  let sm = new SpanManager(
    JSON.parse(localStorage["active-classes"] || "[]"),
    classesToBeActivatedFor(new TimeFinder())
  );

  sm.yeet();
};

let cycleStyle = function () {
  // rotate throught the available stylesheets
  let styleIndex = parseInt(localStorage.styleIndex);
  if (!styleIndex) {
    styleIndex = 0;
  }
  styleIndex = (styleIndex + 1) % validStyles.length;

  let style = validStyles[styleIndex];
  localStorage.styleIndex = styleIndex;

  // fade out and go to new location
  fadeOutAndRedirect(style);
};

let setStyles = function (specified = null) {
  // extract the stylesheet from the querystring and apply it to the element
  let element = document.querySelector("#styles");

  if (specified) {
    element.setAttribute("href", `css/clocks/${specified}.css`);
    return;
  }

  let urlParams = new URLSearchParams(window.location.search);
  let style = urlParams.get("style");

  if (style && validStyles.includes(style)) {
    element.setAttribute("href", `css/clocks/${style}.css`);
  } else {
    element.setAttribute("href", `css/clocks/${validStyles[0]}.css`);
  }
};

// https://codepen.io/chrisbuttery/pen/hvDKi
function fadeOutAndRedirect(style) {
  html.style.opacity = 1;

  (function fade() {
    if (!((html.style.opacity -= conf.fadeIncrement) < 0)) {
      requestAnimationFrame(fade);
    } else {
      location.replace(`?style=${style}`);
    }
  })();
}

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

export { initialise };
