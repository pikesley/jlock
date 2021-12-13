import fs from "fs";

let en = JSON.parse(
  fs.readFileSync("internationalisation/languages/en.json", "utf8")
);
let es = JSON.parse(
  fs.readFileSync("internationalisation/languages/es.json", "utf8")
);
let cy = JSON.parse(
  fs.readFileSync("internationalisation/languages/cy.json", "utf8")
);

export { en, cy, es };
