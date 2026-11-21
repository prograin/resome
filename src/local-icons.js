import { createElement } from "lucide";
import { getIconNode } from "./components/icon-nodes.js";

function makeSvg(name, className) {
  return createElement(getIconNode(name), {
    "aria-hidden": "true",
    "data-lucide": name,
    "data-rendered-icon": name,
    class: className,
  });
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
