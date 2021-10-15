class SpanManager {
  constructor(current, next) {
    this.current = current || [];
    this.next = next || [];

    this.activate = difference(this.next, this.current);
    this.deactivate = difference(this.current, this.next);

    this.diffs = false;

    if (this.activate.length || this.deactivate.length) {
      this.diffs = true;
    }
  }

  yeet() {
    if (this.diffs) {
      this.activate.forEach(function (span) {
        let elements = document.querySelectorAll(span);
        elements.forEach(function (element) {
          element.classList.remove("inactive");
          element.classList.add("active");
        });
      });

      this.deactivate.forEach(function (span) {
        let elements = document.querySelectorAll(span);
        elements.forEach(function (element) {
          element.classList.remove("active");
          element.classList.add("inactive");
        });
      });

      this.save();
    }
  }

  save() {
    console.log(this.next.join(" "));
    localStorage["active-classes"] = JSON.stringify(this.next);
  }
}

// https://stackoverflow.com/a/30288946
function difference(left, right) {
  right = new Set(right);
  return left.filter(function (x) {
    return !right.has(x);
  });
}

export { SpanManager };
