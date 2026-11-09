// Academy page template.
(() => {
  "use strict";

  const copy = {
    fa: {
      title: "آموزش برنامه نویسی پایتون در اراک",
      lead: "آموزش پایتون در اراک، استان مرکزی؛ کلاس خصوصی حضوری یا آنلاین با مسیر متناسب با هدف شما، و دوره نیمه‌خصوصی آنلاین برای یادگیری منظم با تمرین و پروژه عملی.",
      selectorTitle: "نوع آموزش را انتخاب کنید",
      comparisonTitle: "برای تصمیم‌گیری بهتر",
      youtubeTitle: "آموزش‌های رایگان یوتیوب",
      youtubeLead:
        "ما برای شما عزیزان، بخشی از آموزش‌های خود را به صورت رایگان در یوتیوب قرار داده‌ایم تا بتوانید با هر شرایطی یادگیری را شروع کنید. این آموزش‌ها برای افرادی آماده شده‌اند که می‌خواهند به صورت خودآموز یاد بگیرند یا قبل از شرکت در دوره‌های تخصصی با سبک آموزش‌ها آشنا شوند.",
      youtubeCta: "مشاهده کانال یوتیوب",
      tabs: {
        group: "نیمه‌خصوصی آنلاین",
        private: "آموزش خصوصی",
      },
      plans: [
        {
          key: "group",
          icon: "graduation-cap",
          badge: "Best Value",
          title: "نیمه‌خصوصی آنلاین",
          price: "2,500,000 تومان",
          suffix: "/ دوره",
          fit: "مناسب برای شروع یادگیری",
          cta: "پیام یا تماس با مدرس",
          tone: "group",
          features: [
            "کلاس نیمه‌خصوصی آنلاین",
            "۱۶ جلسه آموزشی",
            "سرفصل مشخص",
            "پروژه عملی",
            "تمرین دوره‌ای",
          ],
        },
        {
          key: "private",
          icon: "sparkles",
          badge: "پیشنهاد ویژه",
          title: "آموزش خصوصی",
          price: "650,000 تومان",
          suffix: "/ ساعت",
          fit: "یادگیری کاملاً اختصاصی با تمرکز روی پروژه و هدف شما",
          cta: "پیام یا تماس با مدرس",
          tone: "private",
          featured: true,
          features: [
            "تمرکز کامل روی هدف آموزشی شما",
            "مسیر اختصاصی",
            "بررسی پروژه",
            "رفع مشکل مستقیم",
            "مشاوره شغلی",
          ],
        },
      ],
      comparison: [
        ["نوع کلاس", "نیمه‌خصوصی آنلاین", "اختصاصی"],
        ["تعداد جلسات", "۱۶ جلسه", "هماهنگ با شما"],
        ["مسیر یادگیری", "سرفصل آماده", "Roadmap اختصاصی"],
        ["زمان‌بندی", "طبق برنامه دوره", "هماهنگ با شما"],
        [
          "برنامه آموزشی",
          "برنامه از پیش طراحی‌شده",
          "کاملاً متناسب با نیاز شما",
        ],
        ["سرعت یادگیری", "طبق ریتم کلاس", "یادگیری با ریتم و نیاز شخصی شما"],
        [
          "انتخاب موضوع",
          "سرفصل ثابت",
          "تمرکز روی مهارت‌ها و پروژه‌های موردنیاز شما",
        ],
        ["رفع اشکال", "محدود در زمان مشخص", "رفع اشکال مستقیم و کامل با مدرس"],
        ["بررسی کد", "محدود", "Code Review کامل"],
        ["بررسی پروژه", "بررسی کلی پروژه‌ها", "بررسی دقیق پروژه شخصی"],
        ["پروژه نهایی", "پروژه دوره", "پروژه واقعی شما"],
        ["تمرین و تکلیف", "تمرین‌های استاندارد", "تمرین اختصاصی برای شما"],
        [
          "ارتباط با مدرس",
          "محدود",
          "ارتباط مستقیم با مدرس و دریافت بازخورد تخصصی",
        ],
        ["مشاوره شغلی", "ندارد", "دارد"],
        ["رفع باگ پروژه", "محدود", "مستقیم با مدرس"],
        ["مناسب برای", "شروع یادگیری", "رشد سریع و ورود بازار کار"],
        ["پشتیبانی بعد از کلاس", "طبق قوانین دوره", "قابل تنظیم"],
        ["تغییر مسیر آموزشی", "ندارد یا محدود", "کاملاً امکان‌پذیر"],
      ],
    },
    en: {
      title: "Python training",
      lead: "Choose the learning path that fits your goal: online semi-private training for a structured and affordable start, or private mentoring for faster, focused progress.",
      selectorTitle: "Choose your training type",
      comparisonTitle: "For a better decision",
      youtubeTitle: "Free YouTube Training",
      youtubeLead:
        "I have made part of my training content available for free on YouTube so you can start learning in any situation.\n\nThese lessons are useful for self-paced learning or for getting familiar with the teaching style before joining focused courses.",
      youtubeCta: "View YouTube channel",
      tabs: {
        group: "Online semi-private",
        private: "Private mentoring",
      },
      plans: [
        {
          key: "group",
          icon: "graduation-cap",
          badge: "Best Value",
          title: "Online semi-private",
          price: "2,500,000 Toman",
          suffix: "/ course",
          fit: "Best for starting your learning path",
          cta: "Contact or message instructor",
          tone: "group",
          features: [
            "Online semi-private class",
            "16 training sessions",
            "Defined syllabus",
            "Practical project",
            "Regular exercises",
          ],
        },
        {
          key: "private",
          icon: "sparkles",
          badge: "Personal Mentoring",
          title: "Private mentoring",
          price: "650,000 Toman",
          suffix: "/ hour",
          fit: "Fully personalized learning focused on your project and goal",
          cta: "Contact or message instructor",
          tone: "private",
          featured: true,
          features: [
            "Full focus on your learning goal",
            "Custom roadmap",
            "Project review",
            "Direct troubleshooting",
            "Career guidance",
          ],
        },
      ],
      comparison: [
        ["Class type", "Online semi-private", "One-to-one"],
        ["Session count", "16 sessions", "Coordinated with you"],
        ["Learning path", "Prepared syllabus", "Custom roadmap"],
        ["Scheduling", "Based on course schedule", "Coordinated with you"],
        [
          "Learning plan",
          "Pre-designed program",
          "Fully tailored to your needs",
        ],
        [
          "Learning speed",
          "Class-paced",
          "Based on your personal rhythm and needs",
        ],
        [
          "Topic selection",
          "Fixed syllabus",
          "Focused on the skills and projects you need",
        ],
        [
          "Troubleshooting",
          "Limited scheduled support",
          "Direct, complete troubleshooting with the mentor",
        ],
        ["Code review", "Limited", "Complete code review"],
        [
          "Project review",
          "General project review",
          "Detailed personal project review",
        ],
        ["Final project", "Course project", "Your real project"],
        ["Exercises", "Standard exercises", "Custom exercises for you"],
        [
          "Mentor access",
          "Limited",
          "Direct mentor access and expert feedback",
        ],
        ["Career guidance", "Not included", "Included"],
        ["Project bug fixing", "Limited", "Directly with the mentor"],
        [
          "Best for",
          "Starting the learning path",
          "Fast growth and entering the job market",
        ],
        ["After-class support", "Based on course rules", "Adjustable"],
        ["Path changes", "None or limited", "Fully possible"],
      ],
    },
  };

  const faqs = {
    fa: [
      ["کلاس پایتون در اراک حضوری است یا آنلاین؟", "کلاس خصوصی پایتون به‌صورت حضوری در اراک یا آنلاین برگزار می‌شود. دوره نیمه‌خصوصی آنلاین است. برای هماهنگی شیوه برگزاری و زمان کلاس از صفحه تماس پیام بدهید."],
      ["برای شروع یادگیری پایتون باید از قبل برنامه‌نویسی بلد باشم؟", "مسیر آموزش از مبانی پایتون تا انجام پروژه ارائه می‌شود. پیش از شروع، سطح و هدف شما بررسی می‌شود تا مسیر یادگیری مناسبی انتخاب کنید."],
      ["تفاوت دوره نیمه‌خصوصی با کلاس خصوصی چیست؟", "دوره نیمه‌خصوصی آنلاین، ۱۶ جلسه با سرفصل مشخص، تمرین و پروژه عملی دارد. مسیر کلاس خصوصی با هدف، زمان و نیاز شما هماهنگ می‌شود و امکان بررسی کد و رفع اشکال مستقیم فراهم است."],
      ["چطور برای کلاس پایتون ثبت‌نام کنم؟", "از صفحه تماس با ما، از طریق تلگرام، تماس یا ایمیل پیام بدهید. سطح فعلی، هدفتان و شیوه برگزاری مدنظر را بنویسید تا درباره زمان و مسیر کلاس هماهنگ کنیم."],
    ],
    en: [
      ["Are Python classes in Arak held in person or online?", "Private Python classes are available in person in Arak or online. The semi-private course is online. Contact me to arrange the format and schedule."],
      ["Do I need previous programming experience?", "The learning path runs from Python basics to practical projects. Your current level and goals are discussed before choosing the right path."],
      ["How do private and semi-private classes differ?", "The online semi-private course has 16 sessions, a set syllabus, exercises and a practical project. Private training adapts to your goals and schedule, with direct code review and debugging."],
      ["How can I register for Python classes?", "Use the contact page to reach me by Telegram, phone or email. Include your current level, goal and preferred class format so we can arrange the next steps."],
    ],
  };

  const planCard = (plan, icon) => `
    <article class="academy-plan ${plan.featured ? "is-featured" : ""}" data-academy-plan="${plan.key}" data-tone="${plan.tone}">
      <div class="academy-plan__top">
        <span class="academy-plan__icon">${icon(plan.icon, "h-5 w-5")}</span>
        <span class="academy-plan__badge">${plan.badge}</span>
      </div>
      <h3>${plan.title}</h3>
      <p class="academy-plan__price">
        ${plan.price}
        ${plan.suffix ? `<span>${plan.suffix}</span>` : ""}
      </p>
      <p class="academy-plan__fit">${plan.fit}</p>
      <ul>
        ${plan.features.map((feature) => `<li>${icon("check-circle-2", "h-4 w-4")}<span>${feature}</span></li>`).join("")}
      </ul>
      <a class="academy-plan__cta" href="/contact" data-page-link="contact-page">${plan.cta}</a>
    </article>`;

  const comparisonColumns = (rows, locale, tabs) => {
    const labels = rows.map(([label]) => label);
    const groupItems = rows.map(([, group]) => group);
    const privateItems = rows.map(([, , privatePlan]) => privatePlan);
    const featureTitle = locale === "fa" ? "ویژگی" : "Feature";
    const columns =
      locale === "fa"
        ? [
            { key: "features", title: featureTitle, items: labels },
            {
              key: "private",
              title: `${tabs.private} ✨`,
              items: privateItems,
            },
            { key: "group", title: tabs.group, items: groupItems },
          ]
        : [
            { key: "group", title: tabs.group, items: groupItems },
            { key: "features", title: featureTitle, items: labels },
            {
              key: "private",
              title: `${tabs.private} ✨`,
              items: privateItems,
            },
          ];

    return columns
      .map(
        (column) => `
          <section class="academy-compare-column" data-academy-column="${column.key}">
            <h3>${column.title}</h3>
            <ul>
              ${column.items.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </section>`,
      )
      .join("");
  };

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
          section.querySelector("[data-academy-tab].is-active")?.dataset
            .academyTab || "private";
        activateAcademyPlan(section, active);
        return;
      }

      section.dataset.academyReady = "true";
      section.querySelectorAll("[data-academy-tab]").forEach((tab) => {
        tab.addEventListener("click", () =>
          activateAcademyPlan(section, tab.dataset.academyTab),
        );
      });
      section.querySelector(".academy-tabs")?.addEventListener("keydown", (event) => {
        const tabs = [...section.querySelectorAll("[data-academy-tab]")];
        const current = tabs.indexOf(document.activeElement);
        if (current < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + 1) % tabs.length;
        activateAcademyPlan(section, tabs[next].dataset.academyTab);
        tabs[next].focus();
      });
      activateAcademyPlan(section, "private");
    });
  }

  window.PAGE_ACADEMY_INIT = initAcademyPlans;

  window.PAGE_ACADEMY = function renderAcademyPage(locale = "fa") {
    const { icon } = window.PAGE_SHARED;
    const t = copy[locale] || copy.fa;
    const dir = locale === "fa" ? "rtl" : "ltr";
    const titleClass =
      locale === "fa" ? "tracking-normal" : "tracking-tight";
    const displayPlans =
      locale === "fa" ? [t.plans[1], t.plans[0]] : [t.plans[0], t.plans[1]];

    return `
      <div class="academy-page" dir="${dir}" data-active-plan="private">
        <section class="academy-hero">
          <div class="academy-hero__copy">
            <p class="page-eyebrow">${locale === "fa" ? "آکادمی prograin" : "prograin academy"}</p>
            <h1 class="${titleClass}">${t.title}</h1>
            <p>${t.lead}</p>
          </div>
        </section>

        <section class="academy-picker" data-academy-plans data-defer-background>
          <p class="academy-picker__label">${t.selectorTitle}</p>
          <div class="academy-tabs" role="tablist" aria-label="${t.selectorTitle}">
            <button class="academy-tab is-active" type="button" role="tab" data-academy-tab="private" aria-selected="true">
              ${icon("sparkles", "h-4 w-4")}
              ${t.tabs.private}
            </button>
            <button class="academy-tab" type="button" role="tab" data-academy-tab="group" aria-selected="false">
              ${icon("graduation-cap", "h-4 w-4")}
              ${t.tabs.group}
            </button>
          </div>

          <div class="academy-comparison" aria-label="${t.comparisonTitle}">
            ${displayPlans.map((plan) => planCard(plan, icon)).join("")}
          </div>
        </section>

        <section class="academy-table-section" data-defer-background>
          <div class="academy-table-heading">
            <h2>${t.comparisonTitle}</h2>
          </div>
          <p class="comparison-hint">${locale === "fa" ? "برای دیدن همه ستون‌ها، جدول را افقی حرکت دهید." : "Scroll horizontally to compare all columns."}</p>
          <div class="academy-compare-scroll" tabindex="0" role="region" aria-label="${t.comparisonTitle}">
            <div class="academy-compare-grid">
              ${comparisonColumns(t.comparison, locale, t.tabs)}
            </div>
          </div>
        </section>

        <section class="academy-youtube-section" data-defer-background>
          <div class="academy-youtube-card">
            <span class="academy-youtube-card__icon">${icon("youtube", "h-5 w-5")}<span>YouTube</span></span>
            <div>
              <h2>${t.youtubeTitle}</h2>
              <p>${t.youtubeLead}</p>
            </div>
            <a href="https://www.youtube.com/@Prograin_ARR/playlists" target="_blank" rel="noopener noreferrer">
              ${icon("external-link", "h-4 w-4")}
              <span>${t.youtubeCta}</span>
            </a>
          </div>
          ${window.PAGE_SHARED.faq(locale === "fa" ? "پرسش‌های رایج درباره آموزش پایتون" : "Python training questions", faqs[locale] || faqs.fa)}
        </section>
      </div>`;
  };
})();
