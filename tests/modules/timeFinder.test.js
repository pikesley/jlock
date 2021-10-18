import { TimeFinder } from "modules/timeFinder.js";

describe("TimeFinder", function () {
  it("has the correct time", function () {
    Date.now = jest.fn(() => Date.parse("2021-10-17T13:35"));
    let tf = new TimeFinder();

    expect(tf.hours).toEqual(13);
    expect(tf.minutes).toEqual(35);
  });
});
