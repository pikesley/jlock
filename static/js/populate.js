let spacers = 1; // this should match `clock-spacers` in `sass/base/_vars.scss`

let dot = "•";

let width = 11;
let height = 10;

let clockParts = [
  [{ class: "it" }, { text: "l" }, { class: "is" }, { text: "asampm" }],
  [{ class: "a" }, { text: "c" }, { class: "quarter" }, { text: "dc" }],
  [{ class: "twenty" }, { class: "five" }, { text: "x" }],
  [
    { class: "half" },
    { text: "s" },
    { class: "ten" },
    { text: "f" },
    { class: "to" },
  ],
  [{ class: "past" }, { text: "eru" }, { class: "h-9", text: "nine" }],
  [
    { class: "h-1", text: "one" },
    { class: "h-6", text: "six" },
    { class: "h-3", text: "three" },
  ],
  [
    { class: "h-4", text: "four" },
    { class: "h-5", text: "five" },
    { class: "h-2", text: "two" },
  ],
  [
    { class: "h-8", text: "eight" },
    { class: "h-11", text: "eleven" },
  ],
  [
    { class: "h-7", text: "seven" },
    { class: "h-0", text: "twelve" },
  ],
  [{ class: "h-10", text: "ten" }, { text: "se" }, { class: "oclock" }],
];

let populateClock = function (elementID = "#clock") {
  element = document.querySelector(elementID);
  addDots(element, [1, 2]);

  addBlankRows(element);

  clockParts.forEach(function (row, index) {
    addSpacerSpans(element);

    let count = 0;
    row.forEach(function (cell) {
      content = (cell.text || cell.class).toUpperCase();
      for (character of content) {
        let span = getSpan();
        let content = document.createTextNode(character);
        span.appendChild(content);
        if (cell.class) {
          span.setAttribute("class", cell.class);
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
  for (i = 0; i < spacers + 1; i++) {
    let span = getSpan();
    element.append(span);
  }
};

let addBlankRows = function (element, count = spacers) {
  for (i = 0; i < spacers; i++) {
    for (j = 0; j < width + count * 2 + 2; j++) {
      let span = getSpan();
      element.append(span);
    }
  }
};

let addDots = function (element, minutes) {
  element.append(dotSpan(minutes[0]));

  for (i = 0; i < width + spacers * 2; i++) {
    let span = getSpan();
    element.append(span);
  }

  element.append(dotSpan(minutes[1]));
};

let dotSpan = function (index) {
  let span = getSpan();
  let content = document.createTextNode(dot);
  span.appendChild(content);
  span.setAttribute("class", `m-${index}`);
  span.setAttribute("id", `corner-${index}`);

  return span;
};

let getSpan = function () {
  return document.createElement("span");
};
