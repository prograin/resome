// Mount static page templates into the page containers.
(() => {
  "use strict";

  window.STATIC_PAGES = {
    render() {
      const home = document.getElementById("homePage");
      const order = document.getElementById("orderPage");
      const academy = document.getElementById("academyPage");
      const contact = document.getElementById("contactPage");
      const footer = document.getElementById("siteFooter");

      const locale =
        document.documentElement.getAttribute("lang") === "fa" ? "fa" : "en";

      if (home && window.PAGE_HOME) home.innerHTML = window.PAGE_HOME(locale);
      if (order && window.PAGE_ORDER) order.innerHTML = window.PAGE_ORDER(locale);
      if (academy && window.PAGE_ACADEMY) {
        academy.innerHTML = window.PAGE_ACADEMY(locale);
      }
      if (contact && window.PAGE_CONTACT) {
        contact.innerHTML = window.PAGE_CONTACT(locale);
      }
      if (footer && window.PAGE_SHARED?.footer) {
        footer.innerHTML = window.PAGE_SHARED.footer(locale);
      }
    },
  };
})();
