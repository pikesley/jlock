let en = [
  // members can be one of three types:
  //
  // class-only: these will be rendered like <span class="foo">foo</span>
  // text-only: these will be rendered like <span>foo</span>
  // class-and-text: these will be rendered like <span class="the-class">the text</span>

  [{ class: "it" }, { text: "l" }, { class: "is" }, { text: "asampm" }],
  [{ class: "a" }, { text: "c" }, { class: "quarter" }, { text: "dc" }],
  [{ class: "twenty" }, { class: "five" }, { text: "x" }],
  [
    { class: "half" },
    { text: "s" },
    { class: "ten" },
    { text: "f" },
    { class: "to" },
  ],
  [{ class: "past" }, { text: "eru" }, { class: "h-9", text: "nine" }],
  [
    { class: "h-1", text: "one" },
    { class: "h-6", text: "six" },
    { class: "h-3", text: "three" },
  ],
  [
    { class: "h-4", text: "four" },
    { class: "h-5", text: "five" },
    { class: "h-2", text: "two" },
  ],
  [
    { class: "h-8", text: "eight" },
    { class: "h-11", text: "eleven" },
  ],
  [
    { class: "h-7", text: "seven" },
    { class: "h-0", text: "twelve" },
  ],
  [{ class: "h-10", text: "ten" }, { text: "se" }, { class: "oclock" }],
];

let cy = [
  [
    { class: "it", text: "mae" },
    { text: "l" },
    { class: "is", text: "hin" },
    { text: "asmp" },
  ],
  [{ class: "quarter", text: "chwarter" }, { text: "dld" }],
  [
    { class: "five", text: "bump" },
    { text: "x" },
    { class: "twenty", text: "hugain" },
  ],
  [
    { class: "ten", text: "ddeg" },
    { class: "half", text: "hanner" },
    { class: "to", text: "i" },
  ],
  [
    { class: "past", text: "wedi" },
    { class: "h-3", text: "dri" },
    { class: "h-8", text: "wyth" },
  ],
  [
    { class: "h-6", text: "chwech" },
    { class: "h-7", text: "saith" },
  ],
  [
    { class: "h-0", text: "deu" },
    { classes: ["h-0", "h-10"], text: "ddeg" },
    { class: "h-5", text: "bump" },
  ],
  [
    { class: "h-11", text: "unarddeg" },
    { class: "h-9", text: "naw" },
  ],
  [
    { class: "h-4", text: "bedwar" },
    { text: "l" },
    { class: "h-2", text: "ddau" },
  ],
  [
    { class: "h-1", text: "un" },
    { text: "f" },
    { class: "oclock", text: "or" },
    { text: "e" },
    { class: "oclock", text: "gloch" },
  ],
];

let languages = {
  en: en,
  cy: cy,
};

export { languages };
