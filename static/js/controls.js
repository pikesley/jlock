let validStyles = [];
let fadeTime = 1000; // ms

$(document).ready(function () {
  // fade in
  $("html").css("display", "none");
  $("html").fadeIn(fadeTime);

  populateClock();

  $.get("/css/clocks/", function (data) {
    // discover the available stylesheets
    data.forEach(function (entry) {
      if (entry.name.endsWith("css")) {
        validStyles.push(entry.name.replace(/\.[^/.]+$/, ""));
      }
    });
    setStyles();
  });

  // force it to update on the first load
  localStorage["active-classes"] = null;
  refreshClock();

  // check for updates every second
  setInterval(refreshClock, 1000);

  // call cycleStyle when we get a click anywhere
  $("body").click(function () {
    cycleStyle();
  });
});

let refreshClock = function () {
  // update the clock
  currentClasses = JSON.parse(localStorage["active-classes"] || "[]");
  nextClasses = ClassesToBeActivatedFor(getTime());
  ClassesToBeSwitched = diffClasses(currentClasses, nextClasses);

  if (ClassesToBeSwitched.diffs) {
    applyClass(ClassesToBeSwitched.activate, "active", "inactive");
    applyClass(ClassesToBeSwitched.deactivate, "inactive", "active");

    localStorage["active-classes"] = JSON.stringify(nextClasses);
    console.log(localStorage["active-classes"]);
  }
};

let applyClass = function (classes, appliable, removable) {
  classes.forEach(function (kls) {
    $(kls).each(function (element) {
      $(this).removeClass(removable).addClass(appliable);
    })
  });
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

let diffClasses = function (current, next) {
  // find out which Classes we need to switch on and off
  // https://stackoverflow.com/a/15386005

  activate = $(next).not(current).get();
  deactivate = $(current).not(next).get();

  if (activate.length || deactivate.length) {
    return {
      diffs: true,
      deactivate: $(current).not(next).get(),
      activate: $(next).not(current).get(),
    };
  } else {
    return {
      diffs: false,
    };
  }
};
