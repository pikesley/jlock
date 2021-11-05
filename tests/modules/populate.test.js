import { populateClock } from "modules/populate.js";

it("populates the clock", function () {
  let div = global.document.createElement("div");
  div.setAttribute("id", "test-clock");
  global.document.body.appendChild(div);
  populateClock("#test-clock");

  let itSpans = div.querySelectorAll("span.it");
  expect(itSpans.length).toBe(2);

  let eightSpans = div.querySelectorAll("span.h-8");
  expect(eightSpans.length).toBe(5);

  let bottomRightSpan = div.querySelector("span#cell-10-9");
  expect(bottomRightSpan.classList.contains("oclock")).toBe(true);
});

it("understands welsh", function () {
  let div = global.document.createElement("div");
  div.setAttribute("id", "welsh-clock");
  global.document.body.appendChild(div);
  populateClock("#welsh-clock", "cy");

  let tenSpans = div.querySelectorAll("span.h-10");
  expect(tenSpans.length).toBe(4);

  let lastSpan = tenSpans[tenSpans.length - 1];
  expect(lastSpan.classList.contains("h-0")).toBe(true);
  expect(lastSpan.classList.contains("h-10")).toBe(true);

  let twelveSpans = div.querySelectorAll("span.h-0");
  expect(twelveSpans.length).toBe(7);
  expect(twelveSpans[0].classList.contains("h-0")).toBe(true);
  expect(twelveSpans[0].classList.contains("h-10")).toBe(false);
});
