function activateAcademyPlan(root, key) {
  const page = root.closest(".academy-page");
  if (page) page.dataset.activePlan = key;

  root.querySelectorAll("[data-academy-tab]").forEach((tab) => {
    const isActive = tab.dataset.academyTab === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.tabIndex = isActive ? 0 : -1;
  });

  root.querySelectorAll("[data-academy-plan]").forEach((plan) => {
    const isActive = plan.dataset.academyPlan === key;
    plan.classList.toggle("is-active", isActive);
    plan.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function initAcademyPlans(root = document) {
  root.querySelectorAll("[data-academy-plans]").forEach((section) => {
    if (section.dataset.academyReady === "true") {
      const active =
        section.querySelector("[data-academy-tab].is-active")?.dataset.academyTab || "private";
      activateAcademyPlan(section, active);
      return;
    }

    section.dataset.academyReady = "true";
    section.querySelectorAll("[data-academy-tab]").forEach((tab) => {
      tab.addEventListener("click", () => activateAcademyPlan(section, tab.dataset.academyTab));
    });
    section.querySelector(".academy-tabs")?.addEventListener("keydown", (event) => {
      const tabs = [...section.querySelectorAll("[data-academy-tab]")];
      const current = tabs.indexOf(document.activeElement);
      if (current < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (current + 1) % tabs.length;
      activateAcademyPlan(section, tabs[next].dataset.academyTab);
      tabs[next].focus();
    });
    activateAcademyPlan(section, "private");
  });
}

export { initAcademyPlans };
