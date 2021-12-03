import {
  allButtons,
  makeButtonPending,
  makeButtonSelected,
} from "./modules/buttonManipulations.js";

let currents = {};

let select = function (parameter, id) {
  if (currents[parameter] == id) {
    return;
  }

  makeButtonPending(parameter, id, currents[parameter]);

  sendData(`/controller/${parameter}`, id).then(function () {
    setActive(parameter);
  });
};

let sendData = function (endPoint, value) {
  return fetch(endPoint, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ value: value }),
  });
};

let setActive = function (parameter) {
  fetch(`/controller/${parameter}`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      let value = json[parameter];
      makeButtonSelected(parameter, value);
      console.log(`${parameter}: ${value}`);
      currents[parameter] = value;
    });
};

allButtons().forEach(function (b) {
  b.addEventListener("click", function () {
    select(b.dataset.type, b.dataset.name);
  });
});

["style", "language"].forEach(function (item) {
  setActive(item);
});

document.getElementById("show-metadata").addEventListener("click", function () {
  let element = document.getElementById("git-metadata-modal");
  element.classList.toggle("visible");
});
