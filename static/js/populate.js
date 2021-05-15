let clockParts = [
  [{ id: "it" }, { text: "l" }, { id: "is" }, { text: "asampm" }],
  [{ id: "a" }, { text: "c" }, { id: "quarter" }, { text: "dc" }],
  [{ id: "twenty" }, { id: "five" }, { text: "x" }],
  [{ id: "half" }, { text: "s" }, { id: "ten" }, { text: "f" }, { id: "to" }],
  [{ id: "past" }, { text: "eru" }, { id: "h-9", text: "nine" }],
  [
    { id: "h-1", text: "one" },
    { id: "h-6", text: "six" },
    { id: "h-3", text: "three" },
  ],
  [
    { id: "h-4", text: "four" },
    { id: "h-5", text: "five" },
    { id: "h-2", text: "two" },
  ],
  [
    { id: "h-8", text: "eight" },
    { id: "h-11", text: "eleven" },
  ],
  [
    { id: "h-7", text: "seven" },
    { id: "h-0", text: "twelve" },
  ],
  [{ id: "h-10", text: "ten" }, { text: "se" }, { id: "oclock" }],
];

let populateClock = function () {
  addDots([1, 2]);

  clockParts.forEach(function (row) {
    $("#clock").append($("<span/>"));
    row.forEach(function (cell) {
      content = (cell.text || cell.id).toUpperCase();
      for (character of content) {
        let span = $("<span/>", { text: character });
        if (cell.id) {
          $(span).attr("class", cell.id);
        }
        $("#clock").append(span);
      }
    });
    $("#clock").append($("<span/>"));
  });

  addDots([4, 3]);
};

let addDots = function (minutes) {
  $("#clock").append(dotSpan(minutes[0]));

  for (i = 0; i < 11; i++) {
    $("#clock").append($("<span/>"));
  }

  $("#clock").append(dotSpan(minutes[1]));
};

let dotSpan = function (index) {
  return $("<span/>", { class: `m-${index}`, text: "·" });
};
