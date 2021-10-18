let TimeFinder = class {
  constructor() {
    // so we can test this, by mocking `Date.now()`
    this.actual = new Date(Date.now());
    this.hours = this.actual.getHours();
    this.minutes = this.actual.getMinutes();

    this.checkForFakeTime();
  }

  checkForFakeTime() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("faketime")) {
      let faketime = urlParams.get("faketime").split(":");
      this.hours = parseInt(faketime[0]);
      this.minutes = parseInt(faketime[1]);
    }
  }
};

export { TimeFinder };
