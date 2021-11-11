class DimensionFinder {
  constructor(languageData) {
    this.data = languageData;
    this.rows = this.data.length;

    let col = 0;
    this.data[0].forEach(function (chunk) {
      if ("text" in chunk) {
        col += chunk.text.length;
      } else {
        col += chunk.class.length;
      }
    });

    this.columns = col;
  }
}

export { DimensionFinder };
