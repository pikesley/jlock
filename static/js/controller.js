import {
  allButtons,
  selectiseButton,
  pendButton,
} from "./modules/buttonManipulations.js";

let currents = {
  style: null,
  languages: null,
};

let select = function (parameter, id) {
  if (currents[parameter] == id) {
    return;
  }

  pendButton(parameter, id);

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
      selectiseButton(`#${parameter}-${json[parameter]}`);
      console.log(`${parameter}: ${json[parameter]}`);
      currents[parameter] = json[parameter];
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
