# Test-driven Sass

The morning after I'd spent the evening [precariously lashing-together the first cut of the `rotator`](https://github.com/pikesley/jlock/blob/84c47f711c13d50507ce6bcf19b6c0f2f36afce0/sass/base/_default.scss#L46-L91), I [woke up with the phrase "test-driven Sass" going round my head](https://twitter.com/pikesley/status/1454759899204923393), and was then not surprised to discover that there are of course [frameworks for exactly this](https://github.com/oddbird/true). I was somewhat startled, however, to discover that [the tests _themselves_ are written in Sass](tests/sass/rotator/one-frame.spec.scss).

## Getting it working

I ran across a number of blogposts and StackOverflow answers about how to set everything up, none of which _quite_ worked for me, but I was able to glean enough to get things going, so here's what I did:

### Install `sass-true`

I already had [jest](https://jestjs.io/) and [sass](https://sass-lang.com/) set up and working fine, so I just had to layer a few things over the top. First:

```bash
npm install --save-dev sass-true
```

### Tie `sass-true` in to `jest`

After extensive ham-fisted bumbling, I tracked down a working config file in [this blogpost](https://www.educative.io/blog/sass-tutorial-unit-testing-with-sass-true#jest). So I created `tests/sass/scss.spec.js` as:

```javascript
const path = require("path");
const sassTrue = require("sass-true");
const glob = require("glob");

describe("Sass", () => {
  // Find all of the Sass files that end in `*.spec.scss` in any directory of this project.
  // I use path.resolve because True requires absolute paths to compile test files.
  const sassTestFiles = glob.sync(
    path.resolve(process.cwd(), "tests/**/*.spec.scss")
  );

  // Run True on every file found with the describe and it methods provided
  sassTestFiles.forEach((file) => sassTrue.runSass({ file }, { describe, it }));
});
```

At this point, you _should_ be able to make it (attempt to) run:

```bash
jest tests/sass/scss.spec.js
```

It will fail with

```
Your test suite must contain at least one test.
```

but at least it's plumbed-in correctly now.

### Write a test

Time to create a noddy test - `tests/sass/tools/half.spec.scss`:

```scss
@use "true" as *;
@use "../../../sass/tools";

@include describe("half()") {
  @include it("divides things in half") {
    @include assert-equal(tools.half(23vh), 11.5vh);
  }
}
```

and some Sass to make that test pass, at the path specified in the test file - `sass/tools.scss`:

```scss
@use "sass:math";

@function half($size) {
  @return (math.div($size, 2));
}
```

and now it works!

```bash
jest tests/sass/scss.spec.js
```

```
 PASS  tests/sass/scss.spec.js (9.84 s)
  Sass
    half()
      ✓ divides things in half (3 ms)
```

## And now your existing tests are broken

Before I added all this, and just had my regular `jest` tests, I could just type

```bash
jest
```

and run the tests. Now, that no longer works, and in fact it throws some _really_ unhelpful, cryptic errors:

```
 FAIL  tests/sass/scss.spec.js
  ● Test suite failed to run

    opt/sasstesttest/tests/sass/tools/half.spec.scss: no such file or directory
```

It took me a _very long time_ to get to the bottom of this absolute fuckery, and I still don't fully understand it, but it appears to be because `sass-true` expects `jest` to be run with its `testEnvironment` set to `node`, but my `jest.config.js` has

```javascript
  testEnvironment: "jsdom",
```

I tried futzing around with additional `jest.config.js` files and various other smartarsed things, but the solution upon which I finally alighted was

### Multiple test-runner scripts

The `scripts` field of my `package.json` now looks like this:

```json
  "scripts": {
    "jest-dom": "jest --testPathIgnorePatterns scss",
    "jest-sass": "jest --env node tests/sass/scss.spec.js",
    "test": "npm run jest-dom && npm run jest-sass"
  }
```

so `jest-dom` runs my existing tests, bypassing the Sass tests, and `jest-sass` targets _just_ the Sass tests, setting the `--env` it wants. And `test` runs them both, consecutively.

## Writing some more tests

We might also want to test our `@mixins`. Let's say we have something stupid like this in `tools.scss`:

```scss
$colour: red;

@mixin bgcolour {
  background-color: $colour;
}
```

We can create a test at `tests/sass/tools/bgcolour.spec.scss`:

```scss
@use "true" as *;
@use "../../../sass/tools";

@include describe("bgcolour()") {
  tools.$colour: mauve;

  @include it("gives the correct background-color") {
    @include assert {
      @include output {
        @include tools.bgcolor;
      }

      @include expect {
        background-color: mauve;
      }
    }
  }
}
```

There's something subtle (at least to this idiot) but important to note here: the `expect` block is a direct child of the `assert` block, a peer of the `output` block. I failed to notice this at first and crammed my `expect` into the same block as the `output`, in various increasingly-ludicrous comfigurations, leading to all kinds of `Undefined mixin` and `Mixin "foo" does not accept a content block` errors, and the loss of several hours I'll never see again. I'm out here making these halfwit mistakes so you don't have to.

### Parameterising your tests

You can, in common with other test frameworks, pipe a list of expectations through your tests. Let's change `tests/sass/tools/half.spec.scss`:

```scss
@use "true" as *;
@use "../../../sass/tools";

@include describe("half()") {
  $expectations: (
    23vh: 11.5vh,
    17em: 8.5em,
    4000px: 2000px,
  );

  @each $input, $expected in $expectations {
    @include it("divides #{$input} in half to give #{$expected}") {
      @include assert-equal(tools.half($input), $expected);
    }
  }
}
```

and run it, and:

```bash
 PASS  tests/sass/scss.spec.js (12.35 s)
  Sass
    half()
      ✓ divides 23vh in half to give 11.5vh (3 ms)
      ✓ divides 17em in half to give 8.5em (2 ms)
      ✓ divides 4000px in half to give 2000px (2 ms)
```
