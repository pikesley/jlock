let removeClassFromButton = function (button, klass) {
  button.classList.remove(klass);
};

let addClassToButton = function (button, klass) {
  button.classList.add(klass);
};

let unsetOtherButton = function (parameter, id, previousID) {
  removeClassFromButton(getButton(parameter, previousID), "selected");
};

let makeButtonSelected = function (parameter, id) {
  let button = getButton(parameter, id);
  addClassToButton(button, "selected");
};

let getButton = function (parameter, id) {
  return document.querySelector(makeID(parameter, id));
};

let allButtons = function () {
  return document.querySelectorAll(".btn");
};

let makeID = function (left, right) {
  return `#${left}-${right}`;
};

export { allButtons, makeButtonSelected, unsetOtherButton };
