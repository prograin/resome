// Public page entry: markup and interactions are independent modules.
import { renderAcademyPage } from "./academy/render.js";
import { initAcademyPlans } from "./academy/tabs.js";
import { initAcademyDetails } from "./academy/details-dialog.js";

window.PAGE_ACADEMY = renderAcademyPage;
window.PAGE_ACADEMY_INIT = (root = document) => {
  initAcademyDetails(root);
  initAcademyPlans(root);
};
