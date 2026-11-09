// Shared site identity, canonical routes and SEO data for both build and browser.
(() => {
  "use strict";

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
    home: { path: "/", directory: "", container: "homePage", renderer: "PAGE_HOME", background: "home", body: "home" },
    order: { path: "/order/", directory: "order", container: "orderPage", renderer: "PAGE_ORDER", body: "order" },
    academy: { path: "/academy/", directory: "academy", container: "academyPage", renderer: "PAGE_ACADEMY", background: "academy-hero", body: "academy" },
    "contact-page": { path: "/contact/", directory: "contact", container: "contactPage", renderer: "PAGE_CONTACT", background: "contact", body: "contact" },
    resume: { path: "/resume/", directory: "resume", container: "resumePage", body: "resume", private: true },
  };
  const copy = {
    fa: {
      home: { title: "آموزش برنامه نویسی در اراک، استان مرکزی | prograin", description: "آموزش برنامه‌نویسی و پایتون در اراک، استان مرکزی با احمدرضا رضایی؛ کلاس خصوصی حضوری و آنلاین، دوره نیمه‌خصوصی و طراحی سایت و نرم‌افزار اختصاصی.", label: "خانه" },
      academy: { title: "آموزش پایتون در اراک، استان مرکزی | کلاس خصوصی | prograin", description: "کلاس پایتون در اراک، استان مرکزی؛ آموزش خصوصی حضوری یا آنلاین و دوره نیمه‌خصوصی آنلاین ۱۶ جلسه‌ای، همراه تمرین عملی، بررسی کد و رفع اشکال.", label: "آموزش پایتون" },
      order: { title: "طراحی سایت و سفارش پروژه در اراک | prograin", description: "طراحی سایت و فروشگاه اینترنتی در اراک، استان مرکزی؛ توسعه بک‌اند، ربات تلگرام و اتوماسیون اختصاصی. مقایسه پکیج‌ها و مشاوره برای نیاز کسب‌وکار شما.", label: "سفارش پروژه" },
      "contact-page": { title: "تماس با prograin در اراک، استان مرکزی", description: "ارتباط با احمدرضا رضایی در شهر اراک، استان مرکزی برای کلاس پایتون، طراحی سایت، سفارش پروژه و مشاوره برنامه‌نویسی؛ تماس، تلگرام، ایمیل و لینکدین.", label: "تماس با ما" },
      resume: { title: "Portfolio | Ahmadreza Rezaei", description: "Selected software projects by Ahmadreza Rezaei.", label: "Portfolio" },
    },
    en: {
      home: { title: "Python Training in Arak, Markazi | prograin", description: "Learn Python with Ahmadreza Rezaei in Arak, Markazi Province, Iran. Private in-person or online classes, semi-private courses and custom software development.", label: "Home" },
      academy: { title: "Python Classes in Arak, Markazi | prograin", description: "Private Python classes in Arak, Markazi Province, in person or online, plus a 16-session semi-private online course with practical exercises and code review.", label: "Python training" },
      order: { title: "Web Development in Arak, Markazi | prograin", description: "Custom websites and online stores for businesses in Arak, Markazi Province. Backend systems, Telegram bots and automation. Compare packages and discuss your needs.", label: "Order a project" },
      "contact-page": { title: "Contact prograin | Arak, Markazi, Iran", description: "Contact Ahmadreza Rezaei in Arak, Markazi Province, Iran, for Python classes, website development and custom projects by phone, Telegram, email or LinkedIn.", label: "Contact" },
      resume: { title: "Portfolio | Ahmadreza Rezaei", description: "Selected software projects by Ahmadreza Rezaei.", label: "Portfolio" },
    },
  };

  function metadata(page = "home", locale = "fa") {
    const route = routes[page] || routes.home;
    return {
      ...((copy[locale] || copy.fa)[page] || copy.fa.home),
      canonical: `${origin}${route.path}`,
      robots: route.private ? "noindex, nofollow, noarchive" : "index, follow, max-image-preview:large",
      image: route.private ? `${origin}/assets/icons/icon-512.png` : `${origin}/assets/images/social/${page === "contact-page" ? "contact" : page}.jpg`,
      imageWidth: route.private ? 512 : 1200,
      imageHeight: route.private ? 512 : 630,
      locale: locale === "en" ? "en_US" : "fa_IR",
    };
  }

  function structuredData(page, locale = "fa") {
    if (routes[page]?.private) return null;
    const meta = metadata(page, locale);
    const person = `${origin}/#person`;
    const organization = `${origin}/#organization`;
    const website = `${origin}/#website`;
    const city = `${origin}/#arak`;
    const province = `${origin}/#markazi`;
    const address = { "@type": "PostalAddress", addressLocality: location.city[locale], addressRegion: location.region[locale], addressCountry: location.country };
    const graph = [
      { "@type": "Organization", "@id": organization, name: "prograin", url: `${origin}/`, address, areaServed: [{ "@id": city }, { "@id": province }], logo: { "@type": "ImageObject", url: `${origin}/assets/icons/icon-512.png`, width: 512, height: 512 }, founder: { "@id": person }, email: contact.email, telephone: "+989914663783", sameAs: [`https://t.me/${contact.telegram}`, contact.linkedin, "https://www.youtube.com/@Prograin_ARR"] },
      { "@type": "Person", "@id": person, name: "احمدرضا رضایی", alternateName: "Ahmadreza Rezaei", jobTitle: locale === "fa" ? "برنامه‌نویس و مدرس پایتون" : "Software developer and Python instructor", worksFor: { "@id": organization }, image: `${origin}/assets/images/profile.jpg`, address, knowsAbout: ["Python", "Web development", "Software development", "Programming education"] },
      { "@type": "City", "@id": city, name: location.city[locale], alternateName: locale === "fa" ? "Arak" : "اراک", containedInPlace: { "@id": province } },
      { "@type": "AdministrativeArea", "@id": province, name: locale === "fa" ? "استان مرکزی" : "Markazi Province", containedInPlace: { "@type": "Country", name: "Iran", identifier: "IR" } },
      { "@type": "WebSite", "@id": website, name: "prograin", url: `${origin}/`, publisher: { "@id": organization }, inLanguage: ["fa-IR", "en"] },
      { "@type": page === "contact-page" ? "ContactPage" : "WebPage", "@id": `${meta.canonical}#webpage`, url: meta.canonical, name: meta.title, description: meta.description, inLanguage: locale === "fa" ? "fa-IR" : "en", isPartOf: { "@id": website }, about: { "@id": page === "academy" || page === "order" ? `${meta.canonical}#service` : person }, ...(page === "home" ? {} : { breadcrumb: { "@id": `${meta.canonical}#breadcrumb` } }) },
    ];
    if (page !== "home") graph.push({ "@type": "BreadcrumbList", "@id": `${meta.canonical}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: copy[locale].home.label, item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: meta.label, item: meta.canonical },
      ] });
    if (page === "academy" || page === "order") graph.push({
      "@type": "Service", "@id": `${meta.canonical}#service`,
      name: page === "academy" ? (locale === "fa" ? "آموزش خصوصی و نیمه‌خصوصی پایتون" : "Private and semi-private Python training") : (locale === "fa" ? "طراحی سایت و توسعه نرم‌افزار اختصاصی" : "Custom websites and software development"),
      serviceType: page === "academy" ? "Python training" : "Software development",
      provider: { "@id": person }, url: meta.canonical,
      areaServed: [{ "@id": city }, { "@id": province }, { "@type": "Country", name: "Iran" }],
    });
    return { "@context": "https://schema.org", "@graph": graph };
  }

  window.SITE_CONFIG = { origin, location, contact, routes, metadata, structuredData };
})();
