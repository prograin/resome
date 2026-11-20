import { studentPaths } from "../lib/student-auth/paths.js";

const origin = "https://www.prograin.ir";
const location = {
  city: { fa: "اراک", en: "Arak" },
  region: { fa: "مرکزی", en: "Markazi" },
  label: { fa: "ایران، استان مرکزی، اراک", en: "Arak, Markazi Province, Iran" },
  country: "IR",
};
const contact = {
  email: "ahmadreza.pcg1377@gmail.com",
  phone: "09914663783",
  telegram: "prograin_arr",
  linkedin: "https://www.linkedin.com/in/ahmadreza-rezaei-b60866304",
};
const routes = {
  home: {
    path: "/",
    container: "homePage",
    background: "home",
    body: "home",
  },
  order: {
    path: "/order/",
    container: "orderPage",
    body: "order",
  },
  academy: {
    path: "/academy/",
    container: "academyPage",
    background: "academy-entry",
    body: "academy",
  },
  "academy-consultation": {
    path: "/academy/consultation/",
    container: "academyPage",
    background: "academy-hero",
    body: "academy",
  },
  "academy-students": {
    path: studentPaths.signIn,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "academy-dashboard": {
    path: studentPaths.dashboard,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "academy-admin": {
    path: studentPaths.admin,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "academy-chart": {
    path: studentPaths.chart,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "academy-courses": {
    path: studentPaths.courses,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "academy-history": {
    path: studentPaths.history,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "academy-goals": {
    path: studentPaths.goals,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "academy-profile": {
    path: studentPaths.profile,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "academy-links": {
    path: studentPaths.links,
    container: "academyPage",
    body: "academy",
    noindex: true,
  },
  "contact-page": {
    path: "/contact/",
    container: "contactPage",
    background: "contact",
    body: "contact",
  },
  resume: {
    path: "/resume/",
    container: "resumePage",
    body: "resume",
    private: true,
  },
};

export { origin, location, contact, routes };
