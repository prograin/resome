import { ICONS } from "./components/icon-paths.js";
// local-icons.js
// Small local icon renderer compatible with the lucide.createIcons() calls used by the site.
function makeSvg(name, className) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("data-lucide", name);
  svg.setAttribute("data-rendered-icon", name);
  if (className) svg.setAttribute("class", className);
  svg.innerHTML = ICONS[name] || ICONS.circle;
  return svg;
}

function createIcons(root = document) {
  root.querySelectorAll("[data-lucide]").forEach((el) => {
    const name = el.getAttribute("data-lucide");
    if (!name) return;
    if (el.getAttribute("data-rendered-icon") === name) return;
    const className = el.getAttribute("class") || "";
    el.replaceWith(makeSvg(name, className));
  });
}

export { createIcons };
