// Mount static page templates into the page containers.
(() => {
  "use strict";

  const pages = {
    home: ["homePage", "PAGE_HOME"],
    order: ["orderPage", "PAGE_ORDER"],
    academy: ["academyPage", "PAGE_ACADEMY"],
    "contact-page": ["contactPage", "PAGE_CONTACT"],
  };

  const backgroundObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.add("is-bg-ready");
          backgroundObserver.unobserve(target);
        });
      }, { rootMargin: "600px 0px" })
    : null;

  function mount(id, render, locale) {
    const element = document.getElementById(id);
    if (!element || !render) return;
    if (element.dataset.renderedLocale === locale) {
      element.querySelectorAll("[data-defer-background]:not(.is-bg-ready)").forEach((section) => {
        if (backgroundObserver) backgroundObserver.observe(section);
        else section.classList.add("is-bg-ready");
      });
      return;
    }
    element.querySelectorAll("[data-defer-background]").forEach((section) => {
      backgroundObserver?.unobserve(section);
    });
    element.innerHTML = render(locale);
    element.dataset.renderedLocale = locale;
    element.querySelectorAll("[data-defer-background]").forEach((section) => {
      if (backgroundObserver) backgroundObserver.observe(section);
      else section.classList.add("is-bg-ready");
    });
  }

  window.STATIC_PAGES = {
    render(page, locale) {
      const entry = pages[page];
      if (entry) mount(entry[0], window[entry[1]], locale);
      if (page !== "resume") mount("siteFooter", window.PAGE_SHARED?.footer, locale);
    },
  };
})();
