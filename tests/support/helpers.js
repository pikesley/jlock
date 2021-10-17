let fiveMinutes = function (start) {
  return Array.from({ length: 5 }, (x, i) => i + start);
};

let gatherSpanIDs = function (element) {
  let actives = [];
  let inactives = [];

  element.childNodes.forEach(function (child) {
    if (child.classList.contains("active")) {
      actives.push(child);
    }
    if (child.classList.contains("inactive")) {
      inactives.push(child);
    }
  });

  return {
    actives: actives.map((x) => x.id),
    inactives: inactives.map((x) => x.id),
  };
};

export { fiveMinutes, gatherSpanIDs };
