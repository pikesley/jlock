clockParts = [
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
  clockParts.forEach(function (row, index) {
    $("#clock").append($("<span/>", { class: "row" }));

    row.forEach(function (cell) {
      let span = $("<span/>");

      $(span).attr("id", function () {
        return cell.id;
      });

      $(span).text(function () {
        return (cell.text || cell.id).toUpperCase();
      });

      $("#clock").children().last().append(span);
    });
  });
};
