import { DimensionFinder } from "modules/dimensionFinder.js";
import { languages } from "modules/internationalisation/index.js";

describe("DimensionFinder", function () {
  it("gets the right data", function () {
    let dm = new DimensionFinder(languages.en.data);
    expect(dm.data[0][0]).toEqual({ class: "it" });
  });

  it("works out the rows", function () {
    let dm = new DimensionFinder(languages.en.data);
    expect(dm.rows).toEqual(10);
  });

  it("works out the columns", function () {
    let dm = new DimensionFinder(languages.en.data);
    expect(dm.columns).toEqual(11);

    dm = new DimensionFinder(languages.es.data);
    expect(dm.columns).toEqual(11);

    dm = new DimensionFinder(languages.cy.data);
    expect(dm.columns).toEqual(12);
  });
});
