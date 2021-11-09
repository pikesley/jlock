let conf = {
  spacers: 1, // this should match `clock-spacers` in `sass/base/_vars.scss`
  width: 12, // this should match `clock-width` in `sass/base/_vars.scss`
  fadeIncrement: 0.01,
  dot: "•",

  defaults: {
    // what we'll use when running serverless
    style: "black-on-white",
    language: "en",
  },
};

export { conf };
