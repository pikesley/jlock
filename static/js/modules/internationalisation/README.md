# Multi-lingual clocks

I was asked by my partner (who is half-Welsh) if I could make it tell the time in Welsh. So here we are.

## `language` files

The language data files live in the `languages` directory, named using their [_ISO 639-1_](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code:

```
cy.js
en.js
es.js
```

The format of the `data` field is important:

- each array within the main array represents a row of text on the final clock
- within each row, the objects can be one of the following types:

### text-only

These are unused, filler strings. An object like

```javascript
{
  text: "asampm";
}
```

will be rendered as

```html
<span>A</span>
<span>S</span>
<span>A</span>
<span>M</span>
<span>P</span>
<span>M</span>
```

### class-only

These are used where the text and the class of the spans are the same. An object like

```javascript
{
  class: "half"
}
```

will be rendered as

```html
<span class="half">H</span>
<span class="half">A</span>
<span class="half">L</span>
<span class="half">F</span>
```

### class-and-text

These are used where the text and class of the spans need to be different. An object like

```javascript
{
  class: "h-1", text: "one"
}
```

will be rendered as

```html
<span class="h-1">O</span>
<span class="h-1">N</span>
<span class="h-1">E</span>
```

### multi-class

These are used where we want to assign multiple classes to (some parts of) the text. An object lile

```javascript
{
  classes: ["twentyfive", "five"], text: "five"
}
```

will be rendered as

```html
<span class="twentyfive five">F</span>
<span class="twentyfive five">I</span>
<span class="twentyfive five">V</span>
<span class="twentyfive five">E</span>
```

> See the first row of [`en.js`](languages/es.js) for a fairly complicated example.

## Adding it all up

The total number of rendered spans, following the above rules, _must be the same per-row_ or results are extremely undefined.

## `index.js`

We have to export each language via [`index.js`](index.js):

```javascript
export * from "./languages/cy.js";
export * from "./languages/en.js";
export * from "./languages/es.js";
```

in order to make them available to clients.

## Consuming the languages

To use this data from a client:

```javascript
import { languages } from "./internationalisation/index.js";

let languageData = languages["cy"]["data"];
```

## Adding a language

When implementing a new language, consideration must be given to several things:

### Overall structure

In English, telling the time follows a pattern like

```
it is <interval> <past/to> <hour>
```

where `interval` is _five, ten, quarter_ etc. This is good for making a jlock, because those parts can be grouped together such that the words come out in the correct order: start with _it is_, then bundle up all the _interval_ strings, then _past/to_, then all the _hour_ strings.

In Spanish, it's something like

```
it is <hour> <plus/minus> <interval>
```

which still offers a consistent pattern. A language without this kind of consistency, where things jump around, is likely to be hard to implement.

### Allowing space between key strings

It's (probably) fine to have all the _interval_ words crammed up against each other to optimise the use of space, because they never get activated simultaneously, and the same goes for the _hour_ strings. But there _must_ be spaces around (the equivalent of) _it is_, and _past_ and _to_. I ran into this when implementing Welsh, and it's a subtle bug which will only reveal itself at certain times of the day.

### Dealing with long words

English and Spanish fit into a 11x10 grid, but Welsh has some longer words, and so requires a 12x10 grid. This is fine, as long as all the rows are the same length when rendered as `<span>`s, and in fact `jlock` can support grids from 10x10 to 12x12 (or in fact arbitrary sizes with a couple of [sass tweaks](../../../../sass/base/_vars.scss)).

I am genuinely attempting to implement Basque, which is definitely going to require a bigger grid.
