import { conf } from "../conf.js";

let width;

let populateClock = function (elementID = "#clock", languageData, dimensions) {
  width = dimensions.columns;

  let element = document.querySelector(elementID);

  // remove existing children
  element.querySelectorAll("*").forEach(function (n) {
    n.remove();
  });

  addDots(element, [1, 2]);

  addBlankRows(element);

  languageData.forEach(function (row, index) {
    addSpacerSpans(element);

    let count = 0;
    row.forEach(function (cell) {
      let content = (cell.text || cell.class).toUpperCase();
      for (let character of content) {
        let span = getSpan();
        let content = document.createTextNode(character);
        span.appendChild(content);
        if (cell.class) {
          cell.classes = [cell.class];
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
    for (let j = 0; j < width + conf.spacers * 2 + 2; j++) {
      let span = getSpan();
      element.append(span);
    }
  }
};

let addDots = function (element, minutes) {
  element.append(dotSpan(minutes[0]));

  for (let i = 0; i < width + conf.spacers * 2; i++) {
    let span = getSpan();
    element.append(span);
  }

  element.append(dotSpan(minutes[1]));
};

let dotSpan = function (index) {
  let span = getSpan();
  let content = document.createTextNode(conf.dot);
  span.appendChild(content);
  span.setAttribute("id", `corner-${index}`);

  span.classList.add(`m-${index}`);
  span.classList.add("corner");

  return span;
};

let getSpan = function () {
  return document.createElement("span");
};

export { populateClock };
