let dot = "•";

let width = 11;
let height = 10;
let spacers = 1; // this should match `clock-spacers` in `sass/base/_vars.scss`

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

let populateClock = function () {
  addDots([1, 2]);

  addBlankRows();

  clockParts.forEach(function (row, index) {
    addSpacerSpans();

    let count = 0;
    row.forEach(function (cell) {
      content = (cell.text || cell.class).toUpperCase();
      for (character of content) {
        let span = $("<span/>", { text: character });
        if (cell.class) {
          $(span).attr("class", cell.class);
        }
        $(span).attr("id", `cell-${count}-${index}`);
        count++;

        $("#clock").append(span);
      }
    });
    addSpacerSpans();
  });

  addBlankRows();

  addDots([4, 3]);

  // indexEachCell()
};

let indexEachCell = function () {
  let count = 0;
  $("span").each(function () {
    $(this).attr("id", `cell-${count}`);
    count++;
  });
};

let addSpacerSpans = function () {
  for (i = 0; i < spacers + 1; i++) {
    $("#clock").append($("<span/>"));
  }
};

let addBlankRows = function (count = spacers) {
  for (i = 0; i < spacers; i++) {
    for (j = 0; j < width + count * 2 + 2; j++) {
      $("#clock").append($("<span/>"));
    }
  }
};

let addDots = function (minutes) {
  $("#clock").append(dotSpan(minutes[0]));

  for (i = 0; i < width + spacers * 2; i++) {
    $("#clock").append($("<span/>"));
  }

  $("#clock").append(dotSpan(minutes[1]));
};

let dotSpan = function (index) {
  return $("<span/>", { class: `m-${index}`, text: dot });
};
