import { state, getData } from "./state.js";

function renderStaticTexts() {
  const d = getData();
  const nav = d.ui?.nav || {};
  const sec = d.ui?.sections || {};

  // Navbar
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const pageNav =
    state.locale === "fa"
      ? {
          home: "خانه",
          resume: "نمونه‌کارها",
          order: "پروژه",
          academy: "آکادمی",
          contact: "تماس با ما",
        }
      : {
          home: "Home",
          order: "Order project",
          academy: "Academy",
          contact: "Contact",
        };
  setText("navHomePage", pageNav.home);
  setText("navOrderPage", pageNav.order);
  setText("navAcademyPage", pageNav.academy);
  setText("navContactPage", pageNav.contact);
  setText("mNavHomePage", pageNav.home);
  setText("mNavOrderPage", pageNav.order);
  setText("mNavAcademyPage", pageNav.academy);
  setText("mNavContactPage", pageNav.contact);

  setText("navRoles", nav.roles || "Roles");
  setText("navSkills", nav.skills || "Skills");
  setText("navProjects", nav.projects || "Projects");
  setText("navExperience", nav.experience || "Experience");
  setText("navEducation", nav.education || "Education");
  setText("navContact", nav.contact || "Contact");

  setText("mNavRoles", nav.roles || "Roles");
  setText("mNavAbout", nav.about || "About");
  setText("mNavSkills", nav.skills || "Skills");
  setText("mNavProjects", nav.projects || "Projects");
  setText("mNavExperience", nav.experience || "Experience");
  setText("mNavEducation", nav.education || "Education");
  setText("mNavContact", nav.contact || "Contact");

  // Section titles
  setText("titleRoles", sec.roles || "Roles");
  setText("titleSkills", sec.skills || "Skills");
  setText("titleProjects", sec.projects || "Projects");
  setText("titleExperience", sec.experience || "Experience");
  setText("titleEducation", sec.education || "Education");
  setText("titleContact", sec.contact || "Contact");

  // Theme label
  const themeLabel = document.querySelector("#themeToggle span");
  if (themeLabel) themeLabel.textContent = state.locale === "fa" ? "پوسته" : "Theme";
}

export { renderStaticTexts };
