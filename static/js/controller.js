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

document.querySelectorAll(".btn").forEach(function (button) {
  button.addEventListener("click", function () {
    select(button.dataset.type, button.dataset.name);
  });

  buttons[button.dataset.type][button.dataset.name] =
    button.getBoundingClientRect();
});

let select = function (parameter, id) {
  if (currents[parameter] == id) {
    return;
  }

  socket.send({ [parameter]: id });

  let button = buttons[parameter][id];
  let deltaX = button.left - stripUnits(indicators[parameter].style.left);
  let deltaY = button.top - stripUnits(indicators[parameter].style.top);

  ["height", "width"].forEach(function (attribute) {
    indicators[parameter].style[
      attribute
    ] = `${buttons[parameter][id][attribute]}px`;
  });

  indicators[
    parameter
  ].style.transform = `translateX(${deltaX}px) translateY(${deltaY}px)`;

  document
    .getElementById(makeID(parameter, currents[parameter]))
    .classList.remove("selected");
  document.getElementById(makeID(parameter, id)).classList.add("selected");

  currents[parameter] = id;
};

let stripUnits = function (value) {
  return value.replace(/(.*)px/, "$1");
};

let locateIndicator = function (parameter, data) {
  ["top", "left"].forEach(function (attribute) {
    indicators[parameter].style[attribute] = `${
      buttons[parameter][data[parameter]][attribute]
    }px`;
  });

  ["height", "width"].forEach(function (attribute) {
    indicators[parameter].style[attribute] = `${
      buttons[parameter][data[parameter]][attribute]
    }px`;
  });

  document
    .getElementById(makeID(parameter, data[parameter]))
    .classList.add("selected");
};

let makeID = function (left, right) {
  return `${left}-${right}`;
};

socket.on("style", function (json) {
  if (firstRun["style"]) {
    locateIndicator("style", json);
    currents["style"] = json["style"];
    firstRun["style"] = false;
  }
});

socket.on("language", function (json) {
  if (firstRun["language"]) {
    locateIndicator("language", json);
    currents["language"] = json["language"];
    firstRun["language"] = false;
  }
});

document.getElementById("show-metadata").addEventListener("click", function () {
  let element = document.getElementById("git-metadata-modal");
  element.classList.toggle("visible");
});
