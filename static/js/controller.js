import { io } from "./vendor/socket.io.esm.min.js";
import {
  allButtons,
  makeButtonSelected,
  unsetOtherButton,
} from "./modules/buttonManipulations.js";

let currents = {};
let socket = io(`ws://${location.hostname}:5000`);

let makeActive = function (parameter, json) {
  let value = json[parameter];
  makeButtonSelected(parameter, value);
  console.log(`${parameter}: ${value}`);
  currents[parameter] = value;
};

let select = function (parameter, id) {
  if (currents[parameter] == id) {
    return;
  }

  unsetOtherButton(parameter, id, currents[parameter]);
  socket.send({ [parameter]: id });
};

allButtons().forEach(function (b) {
  b.addEventListener("click", function () {
    select(b.dataset.type, b.dataset.name);
  });
});

document.getElementById("show-metadata").addEventListener("click", function () {
  let element = document.getElementById("git-metadata-modal");
  element.classList.toggle("visible");
});

socket.on("style", function (json) {
  makeActive("style", json);
});

socket.on("language", function (json) {
  makeActive("language", json);
});
