describe("diffIDs", function () {
  it("diffs the `current` and `next` ID lists", function () {
    current = ["#it", "#is", "#five", "#to", "#h-5"];
    next = ["#it", "#is", "#oclock", "#h-5"];
    expect(diffIDs(current, next)).toEqual({
      diffs: true,
      deactivate: ["#five", "#to"],
      activate: ["#oclock"],
    });
  });

  it("diffs correctly when there's no `current` list", function () {
    current = [];
    next = ["#it", "#is", "#half", "#past", "#h-2"];
    expect(diffIDs(current, next)).toEqual({
      diffs: true,
      deactivate: [],
      activate: ["#it", "#is", "#half", "#past", "#h-2"],
    });
  });

  it("knows when there's no diff", function () {
    current = ["#it", "#is", "#half", "#past", "#h-2"];
    next = ["#it", "#is", "#half", "#past", "#h-2"];
    expect(diffIDs(current, next)).toEqual({
      diffs: false,
    });
  });
});


