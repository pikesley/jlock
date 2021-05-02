let validStyles = [];

$(document).ready(function () {
  populateClock();

  $.get("/css/", function (data) {
    // discover the available stylesheets
    data.forEach(function (entry) {
      if (entry.name.endsWith("css")) {
        validStyles.push(entry.name.replace(/\.[^/.]+$/, ""));
      }
    });
    setStyles();
  });

  // force it to update on the first load
  localStorage["active-ids"] = null;
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
  currentIDs = JSON.parse(localStorage["active-ids"] || "[]");
  nextIDs = IDsToBeActivatedFor(getTime());
  IDsToBeSwitched = diffIDs(currentIDs, nextIDs);

  if (IDsToBeSwitched.diffs) {
    applyClass(IDsToBeSwitched.activate, "active");
    applyClass(IDsToBeSwitched.deactivate, "inactive");

    localStorage["active-ids"] = JSON.stringify(nextIDs);
    console.log(localStorage["active-ids"]);
  }
};

let applyClass = function (ids, cls) {
  ids.forEach(function (id) {
    $(id).removeClass().addClass(cls);
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
  location.replace(`?style=${style}`);
};

let setStyles = function () {
  // extract the stylesheet from the querystring and apply it to the element
  let urlParams = new URLSearchParams(window.location.search);
  let style = urlParams.get("style");

  if (style && validStyles.includes(style)) {
    $("#styles").attr("href", `css/${style}.css`);
  } else {
    $("#styles").attr("href", `css/${validStyles[0]}.css`);
  }
};

let diffIDs = function (current, next) {
  // find out which IDs we need to switch on and off
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
