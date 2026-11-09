const origin = "https://prograin.ir";
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
    directory: "",
    container: "homePage",
    renderer: "PAGE_HOME",
    background: "home",
    body: "home",
  },
  order: {
    path: "/order/",
    directory: "order",
    container: "orderPage",
    renderer: "PAGE_ORDER",
    body: "order",
  },
  academy: {
    path: "/academy/",
    directory: "academy",
    container: "academyPage",
    renderer: "PAGE_ACADEMY",
    background: "academy-hero",
    body: "academy",
  },
  "contact-page": {
    path: "/contact/",
    directory: "contact",
    container: "contactPage",
    renderer: "PAGE_CONTACT",
    background: "contact",
    body: "contact",
  },
  resume: {
    path: "/resume/",
    directory: "resume",
    container: "resumePage",
    body: "resume",
    private: true,
  },
};

export { origin, location, contact, routes };
