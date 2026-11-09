import { createHelpers } from "./helpers.js";
import { createFilterModel } from "./filter-model.js";
import { createPrivacy } from "./privacy.js";
import { createContacts } from "./contacts.js";
import { createHero } from "./hero.js";
import { createFilters } from "./filters.js";
import { createSkills } from "./skills.js";
import { createProjectCard } from "./project-card.js";
import { createProjects } from "./projects.js";
import { createHistory } from "./history.js";
import { createProjectDetails } from "./project-details.js";
import { createImageGallery } from "./image-gallery.js";
import { createEvents } from "./events.js";

window.CREATE_RESUME_UI = (services) => {
  const { state } = services;
  const context = { ...services, $: (selector, root = document) => root.querySelector(selector) };
  for (const create of [
    createHelpers,
    createFilterModel,
    createPrivacy,
    createContacts,
    createHero,
    createFilters,
    createSkills,
    createProjectCard,
    createProjects,
    createHistory,
    createProjectDetails,
    createImageGallery,
    createEvents,
  ])
    Object.assign(context, create(context));
  let resumeLocale = null;
  function renderResume() {
    if (resumeLocale === state.locale) return;
    resumeLocale = state.locale;
    context.renderTop();
    context.renderChips();
    context.renderProjectFilterSelect();
    context.renderActiveRolePill();
    context.renderSkills();
    context.renderProjects();
    context.renderExperience();
    context.renderEducation();
  }

  context.attachResumeEvents();
  return { render: renderResume };
};
