import { conf } from "../conf.js";
import { languages } from "./internationalisation/index.js";

let populateClock = function (elementID = "#clock", language = "en") {
  let clockParts = languages[language]["data"];

  let element = document.querySelector(elementID);
  addDots(element, [1, 2]);

  addBlankRows(element);

  clockParts.forEach(function (row, index) {
    addSpacerSpans(element);

    let count = 0;
    row.forEach(function (cell) {
      let content = (cell.text || cell.class).toUpperCase();
      for (let character of content) {
        let span = getSpan();
        let content = document.createTextNode(character);
        span.appendChild(content);
        if (cell.class) {
          span.setAttribute("class", cell.class);
        }
        if (cell.classes) {
          cell.classes.forEach(function (klass) {
            span.classList.add(klass);
          });
        }
        span.setAttribute("id", `cell-${count}-${index}`);
        count++;

        element.append(span);
      }
    });
    addSpacerSpans(element);
  });

  addBlankRows(element);

  addDots(element, [4, 3]);
};

let addSpacerSpans = function (element) {
  for (let i = 0; i < conf.spacers + 1; i++) {
    let span = getSpan();
    element.append(span);
  }
};

let addBlankRows = function (element) {
  for (let i = 0; i < conf.spacers; i++) {
    for (let j = 0; j < conf.width + conf.spacers * 2 + 2; j++) {
      let span = getSpan();
      element.append(span);
    }
  }
};

let addDots = function (element, minutes) {
  element.append(dotSpan(minutes[0]));

  for (let i = 0; i < conf.width + conf.spacers * 2; i++) {
    let span = getSpan();
    element.append(span);
  }

  element.append(dotSpan(minutes[1]));
};

let dotSpan = function (index) {
  let span = getSpan();
  let content = document.createTextNode(conf.dot);
  span.appendChild(content);
  span.setAttribute("class", `m-${index}`);
  span.setAttribute("id", `corner-${index}`);

  return span;
};

let getSpan = function () {
  return document.createElement("span");
};

export { populateClock };
