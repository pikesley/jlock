import { populateClock } from "modules/populate.js";

it("populates the clock", function () {
  let div = global.document.createElement("div");
  div.setAttribute("id", "test-clock");
  global.document.body.appendChild(div);
  populateClock("#test-clock");

  let itSpans = global.document.querySelectorAll("span.it");
  expect(itSpans.length).toBe(2);

  let eightSpans = global.document.querySelectorAll("span.h-8");
  expect(eightSpans.length).toBe(5);

  let bottomRightSpan = global.document.querySelector("span#cell-10-9");
  expect(bottomRightSpan.classList.contains("oclock")).toBe(true);
});
