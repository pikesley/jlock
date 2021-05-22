let validStyles = [];
let fadeTime = 1000; // ms

let initialise = function () {
  // fade in
  $("html").css("display", "none");
  $("html").fadeIn(fadeTime);

  $.get("/css/clocks/", function (data) {
    // discover the available stylesheets
    data.forEach(function (entry) {
      if (entry.name.endsWith("css")) {
        validStyles.push(entry.name.replace(/\.[^/.]+$/, ""));
      }
    });
    setStyles();
  });

  populateClock();

  // force it to update on the first load
  localStorage["active-classes"] = null;
  refreshClock();

  // check for updates every second
  setInterval(refreshClock, 1000);

  // call cycleStyle when we get a click anywhere
  $("body").click(function () {
    cycleStyle();
  });
};

let refreshClock = function () {
  // update the clock
  sm = new SpanManager(
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

  style = validStyles[styleIndex];
  localStorage.styleIndex = styleIndex;

  // fade out and go to new location
  $("html").fadeOut(fadeTime, function () {
    location.replace(`?style=${style}`);
  });
};

let setStyles = function () {
  // extract the stylesheet from the querystring and apply it to the element
  let urlParams = new URLSearchParams(window.location.search);
  let style = urlParams.get("style");

  if (style && validStyles.includes(style)) {
    $("#styles").attr("href", `css/clocks/${style}.css`);
  } else {
    $("#styles").attr("href", `css/clocks/${validStyles[0]}.css`);
  }
};

let SpanManager = class {
  constructor(current, next) {
    this.current = current;
    this.next = next;

    this.activate = $(next).not(current).get();
    this.deactivate = $(current).not(next).get();
    this.diffs = false;

    if (this.activate.length || this.deactivate.length) {
      this.diffs = true;
    }
  }

  yeet() {
    if (this.diffs) {
      this.activate.forEach(function (spans) {
        $(spans).each(function () {
          $(this).removeClass("inactive").addClass("active");
        });
      });

      this.deactivate.forEach(function (spans) {
        $(spans).each(function () {
          $(this).removeClass("active").addClass("inactive");
        });
      });

      this.save();
    }
  }

  save() {
    console.log(this.next.join(" "));
    localStorage["active-classes"] = JSON.stringify(this.next);
  }
};

let TimeFinder = class {
  constructor() {
    this.actual = new Date()
    this.hours = this.actual.getHours()
    this.minutes = this.actual.getMinutes()

    this.checkForFakeTime()
  }

  checkForFakeTime() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("faketime")) {
      faketime = urlParams.get("faketime").split(":");
      this.hours = faketime[0];
      this.minutes = faketime[1];
    }
  }
}
