let cleanButtons = function (parameter) {
  let buttons = document.querySelectorAll(`#${parameter}s .btn`);
  buttons.forEach(function (button) {
    cleanButton(button);
  });
};

let cleanButton = function (button) {
  ["selected", "pending"].forEach(function (state) {
    unclassButton(button, state);
  });
};

function unclassButton(button, klass) {
  button.classList.remove(klass);
}

let pendButton = function (parameter, id) {
  cleanButtons(parameter);
  setButtonClass(`#${parameter}-${id}`, "pending");
};

let selectiseButton = function (id) {
  unclassButton(getButton(id), "pending");
  setButtonClass(id, "selected");
};

let setButtonClass = function (id, klass) {
  getButton(id).classList.add(klass);
};

let getButton = function (id) {
  return document.querySelector(id);
};

let allButtons = function () {
  return document.querySelectorAll(".btn");
};

export { allButtons, pendButton, selectiseButton };
