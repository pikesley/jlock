import { io } from "./vendor/socket.io.esm.min.js";

let socket = io(`ws://${location.hostname}:5000`);

let buttons = {
  style: {},
  language: {},
};

let indicators = {
  style: document.getElementById("style-indicator"),
  language: document.getElementById("language-indicator"),
};

let firstRun = {
  style: true,
  language: true,
};

let currents = {};

let select = function (parameter, id) {
  if (currents[parameter] == id) {
    return;
  }

  socket.send({ [parameter]: id });

  resizeIndicator(parameter, id);
  yeetIndicator(parameter, id);
  selectify(parameter, id);
  currents[parameter] = id;
};

let selectify = function (parameter, id) {
  try {
    document
      .getElementById(makeID(parameter, currents[parameter]))
      .classList.remove("selected");
  } catch (TypeError) {}
  document.getElementById(makeID(parameter, id)).classList.add("selected");
};

let yeetIndicator = function (parameter, id) {
  let deltas = getDeltas(parameter, id);
  indicators[
    parameter
  ].style.transform = `translateX(${deltas.x}) translateY(${deltas.y})`;
};

let resizeIndicator = function (parameter, id) {
  ["height", "width"].forEach(function (attribute) {
    setAttribute(parameter, id, attribute);
  });
};

let locateIndicator = function (parameter, id) {
  ["top", "left"].forEach(function (attribute) {
    setAttribute(parameter, id, attribute);
  });

  resizeIndicator(parameter, id);
  selectify(parameter, id);
};

let initialiseIndicator = function (parameter, json) {
  if (firstRun[parameter]) {
    let id = json[parameter];
    locateIndicator(parameter, id);
    currents[parameter] = id;
    firstRun[parameter] = false;
  }
};

let getDeltas = function (parameter, id) {
  let button = buttons[parameter][id];
  return {
    x: addUnits(button.left - stripUnits(indicators[parameter].style.left)),
    y: addUnits(button.top - stripUnits(indicators[parameter].style.top)),
  };
};

let makeID = function (left, right) {
  return `${left}-${right}`;
};

let addUnits = function (value) {
  return `${value}px`;
};

let stripUnits = function (value) {
  return value.replace(/(.*)px/, "$1");
};

let setAttribute = function (parameter, id, attribute) {
  indicators[parameter].style[attribute] = addUnits(
    buttons[parameter][id][attribute]
  );
};

document.querySelectorAll(".btn").forEach(function (button) {
  button.addEventListener("click", function () {
    select(button.dataset.type, button.dataset.name);
  });

  buttons[button.dataset.type][button.dataset.name] =
    button.getBoundingClientRect();
});

document.getElementById("show-metadata").addEventListener("click", function () {
  let element = document.getElementById("git-metadata-modal");
  element.classList.toggle("visible");
});

["style", "language"].forEach(function (parameter) {
  socket.on(parameter, function (json) {
    initialiseIndicator(parameter, json);
  });
});
