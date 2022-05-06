// Function
export function isVisible(elem) {
  if (!(elem instanceof Element))
    throw Error("DomUtil: elem is not an element.");
  const style = getComputedStyle(elem);
  if (style.display === "none") return false;
  if (style.visibility !== "visible") return false;
  if (style.opacity < 0.1) return false;
  if (
    elem.offsetWidth +
      elem.offsetHeight +
      elem.getBoundingClientRect().height +
      elem.getBoundingClientRect().width ===
    0
  ) {
    return false;
  }
  const elemCenter = {
    x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
    y: elem.getBoundingClientRect().top + elem.offsetHeight / 2,
  };
  if (elemCenter.x < 0) return false;
  if (
    elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)
  )
    return false;
  if (elemCenter.y < 0) return false;
  if (
    elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)
  )
    return false;
  let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
  do {
    if (pointContainer === elem) return true;
  } while ((pointContainer = pointContainer.parentNode));
  return false;
}

export function checkScrollBar(element, dir) {
  dir = dir === "vertical" ? "scrollTop" : "scrollLeft";

  var res = !!element[dir];

  if (!res) {
    element[dir] = 1;
    res = !!element[dir];
    element[dir] = 0;
  }
  return res;
}
