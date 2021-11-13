import { populateClock } from "modules/populate.js";
import * as languages from "modules/internationalisation/index.js";
import { DimensionFinder } from "modules/dimensionFinder.js";

it("populates the clock", function () {
  let div = global.document.createElement("div");
  div.setAttribute("id", "test-clock");
  global.document.body.appendChild(div);

  let languageData = languages["en"].data;
  let dimensions = new DimensionFinder(languageData);
  populateClock("#test-clock", languageData, dimensions);

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

  let languageData = languages["cy"].data;
  let dimensions = new DimensionFinder(languageData);
  populateClock("#test-clock", languageData, dimensions);
  populateClock("#welsh-clock", languageData, dimensions);

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
