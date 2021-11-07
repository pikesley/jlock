class SpanManager {
  // activate / deactivate the spans

  constructor(current, next) {
    // these might be null (actually, only `current` should ever be null, but whatever)
    this.current = current || [];
    this.next = next || [];

    // which spans should we activate / deactivate
    this.activate = difference(this.next, this.current);
    this.deactivate = difference(this.current, this.next);

    // we'll only do anything if there are differences
    this.diffs = false;
    if (this.activate.length || this.deactivate.length) {
      this.diffs = true;
    }
  }

  yeet() {
    // actually switch the spans
    if (this.diffs) {
      // this ordering is IMPORTANT - activating before deactivating causes things to be deactivated incorrectly
      // see tests/activationBugFix.test.js
      this.deactivate.forEach(function (span) {
        let elements = document.querySelectorAll(span);
        elements.forEach(function (element) {
          element.classList.remove("active");
          element.classList.add("inactive");
        });
      });

      this.activate.forEach(function (span) {
        let elements = document.querySelectorAll(span);
        elements.forEach(function (element) {
          element.classList.remove("inactive");
          element.classList.add("active");
        });
      });

      // and save our game for the next round
      this.save();
    }
  }

  save() {
    // save our state
    console.log(this.next.join(" "));
    localStorage["active-classes"] = JSON.stringify(this.next);
  }
}

// https://stackoverflow.com/a/30288946
function difference(left, right) {
  // find the difference between two arrays
  right = new Set(right);
  return left.filter(function (x) {
    return !right.has(x);
  });
}

export { SpanManager };
