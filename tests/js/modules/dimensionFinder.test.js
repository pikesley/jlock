import { DimensionFinder } from "modules/dimensionFinder.js";
import { en, cy, es } from "../support/languages.js";

describe("DimensionFinder", function () {
  it("gets the right data", function () {
    let dm = new DimensionFinder(en.data);
    expect(dm.data[0][0]).toEqual({ class: "it" });
  });

  it("works out the rows", function () {
    let dm = new DimensionFinder(en.data);
    expect(dm.rows).toEqual(10);
  });

  it("works out the columns", function () {
    let dm = new DimensionFinder(en.data);
    expect(dm.columns).toEqual(11);

    dm = new DimensionFinder(es.data);
    expect(dm.columns).toEqual(11);

    dm = new DimensionFinder(cy.data);
    expect(dm.columns).toEqual(12);
  });
});
