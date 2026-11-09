// Public page entry: service cards, packages and dialogs live in their own modules.
import { renderOrderPage } from "./order/render.js";
import { initPricing } from "./order/details-dialog.js";
window.PAGE_ORDER = renderOrderPage;
window.PAGE_ORDER_INIT = initPricing;
