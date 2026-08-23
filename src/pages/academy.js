// Academy page template.
(() => {
  "use strict";

  const copy = {
    fa: {
      kicker: "Academy",
      title: "آموزش پایتون",
      lead: "این مسیر فقط یادگیری Python نیست؛ از فهم مفاهیم و تمرین اصولی شروع می‌شود و تا ساخت پروژه واقعی، استقرار روی سرور، آماده‌سازی Portfolio و ورود حرفه‌ای به بازار کار ادامه پیدا می‌کند. برای ارتباط و اطلاع از قیمت‌ها پیام بدهید.",
      telegram: "پیام در تلگرام",
      phone: "تماس مستقیم",
      pathTitle: "مسیر یادگیری",
      path: "Python → کتابخانه‌ها → Web → Database → Deployment → انتشار → Portfolio → بازار کار",
      features: [
        "آموزش با مفاهیم، ابزارها و استانداردهای روز برنامه‌نویسی",
        "آماده‌سازی برای آینده شغلی و ورود حرفه‌ای به بازار کار",
        "ساخت پروژه‌های واقعی برای رزومه و Portfolio قوی",
        "آموزش ارائه و معرفی پروژه برای مصاحبه و شرکت‌های حرفه‌ای",
        "مشاوره و همراهی در مسیر یادگیری و ورود به بازار کار",
        "استقرار پروژه روی سرور و آماده‌سازی برای استفاده عمومی",
        "تبدیل پروژه به سرویس یا محصول قابل استفاده و درآمدزا",
        "استفاده از Git و GitHub در طول دوره برای مدیریت و ارائه پروژه‌ها",
      ],
      stats: [
        ["+۱۰", "کلاس برگزارشده"],
        ["+۵", "شاگرد خصوصی"],
        ["+۵۰", "شاگرد عمومی"],
      ],
      visualTitle: "Python Learning Path",
      visualText: "از مبانی زبان تا پروژه، رزومه و آماده‌سازی برای مسیر کاری.",
    },
    en: {
      kicker: "Academy",
      title: "Python training",
      lead: "This path is not only about learning Python. It starts with real understanding and guided practice, then moves into real projects, deployment, portfolio building, and professional career readiness. Message me for details and pricing.",
      telegram: "Message on Telegram",
      phone: "Direct call",
      pathTitle: "Learning path",
      path: "Python → Libraries → Web → Database → Deployment → Release → Portfolio → Job market",
      features: [
        "Training with modern programming concepts, tools, and standards",
        "Preparation for professional career entry and future work",
        "Real projects for a stronger resume and portfolio",
        "Project presentation practice for interviews and companies",
        "Guidance through learning, portfolio building, and job readiness",
        "Deployment on servers and preparation for public use",
        "Turning projects into useful services, products, and income paths",
        "Using Git and GitHub throughout the course to manage and present projects",
      ],
      stats: [
        ["+10", "Classes held"],
        ["+5", "Private students"],
        ["+50", "Group students"],
      ],
      visualTitle: "Python Learning Path",
      visualText: "From language fundamentals to projects, resume work, and career preparation.",
    },
  };

  const statCard = ([value, label]) => `
    <div class="rounded-lg border border-slate-200/80 bg-white/55 px-4 py-3 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-900/35">
      <span class="block text-2xl font-bold text-cyan-700 dark:text-cyan-300">${value}</span>
      <span class="mt-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">${label}</span>
    </div>`;

  const featureItem = (text, index) => {
    const positions = ["sm:self-end", "sm:self-start", "sm:self-end", "sm:self-start", "sm:self-end", "sm:self-start", "sm:self-end"];
    const floats = ["float-card-a", "float-card-b", "float-card-c", "float-card-a", "float-card-b", "float-card-c", "float-card-a"];

    return `
    <li class="float-card ${floats[index]} flex w-[92%] max-w-md items-start gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm leading-7 text-slate-700 shadow-softer backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 sm:w-[88%] ${positions[index]}">
      <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600 dark:bg-cyan-300"></span>
      <span>${text}</span>
    </li>`;
  };

  const pathMap = (path) => {
    const tones = [
      "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/45 dark:text-cyan-100",
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/45 dark:text-emerald-100",
      "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
      "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
    ];

    const steps = path
      .split("→")
      .map((step) => step.trim())
      .filter(Boolean);

    return steps
      .map(
        (step, index) => `
          <span class="inline-flex items-center gap-2">
            <span class="rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-sm ${tones[index % tones.length]}">${step}</span>
            ${index < steps.length - 1 ? '<span class="text-slate-400 dark:text-slate-500">→</span>' : ""}
          </span>`,
      )
      .join("");
  };

  window.PAGE_ACADEMY = function renderAcademyPage(locale = "fa") {
    const { contact, cta } = window.PAGE_SHARED;
    const t = copy[locale] || copy.fa;
    const dir = locale === "fa" ? "rtl" : "ltr";
    const textAlignClass =
      locale === "fa" ? "text-right" : "text-left";
    const mxClass = locale === "fa" ? "ms-auto" : "me-auto";
    const ctaAlignClass = "justify-start";
    const textOrderClass = locale === "fa" ? "lg:order-2" : "lg:order-1";
    const featuresOrderClass = locale === "fa" ? "lg:order-1" : "lg:order-2";

    return `
      <div class="box-border min-h-[calc(100svh-4rem)] w-full overflow-x-hidden py-4 sm:py-6" dir="${dir}">
        <section class="motion-rise flex min-h-[calc(100svh-7rem)] w-full flex-col justify-center gap-6 sm:gap-8">
          <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="grid w-full items-center gap-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-10 lg:[direction:ltr]">
            <div class="order-1 ${textAlignClass} ${textOrderClass}" dir="${dir}">
              <h1 class="${mxClass} max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                ${t.title}
              </h1>

              <p class="${mxClass} mt-4 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-8">
                ${t.lead}
              </p>

              <div class="mt-6 flex flex-wrap ${ctaAlignClass} gap-3">
                ${cta(`https://t.me/${contact.telegram}`, t.telegram, "send", "cyan", 'target="_blank" rel="noopener noreferrer"')}
                ${cta(`tel:${contact.phone}`, t.phone, "phone", "emerald")}
              </div>
            </div>

            <ul class="order-2 flex w-full flex-col items-center gap-2 sm:gap-3 ${featuresOrderClass}" dir="${dir}">
              ${t.features.map(featureItem).join("")}
            </ul>
          </div>
          </div>

          <div class="w-full px-4 sm:px-6 lg:px-8">
            <div class="mb-3 rounded-lg border border-cyan-100/80 bg-cyan-50/45 p-3 text-center text-sm text-cyan-950 shadow-sm backdrop-blur-xl dark:border-cyan-950/70 dark:bg-cyan-950/18 dark:text-cyan-100">
              <p class="font-semibold">${t.pathTitle}</p>
              <div class="mt-2 flex flex-wrap items-center justify-center gap-2 [unicode-bidi:plaintext]" dir="ltr">
                ${pathMap(t.path)}
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
              ${t.stats.map(statCard).join("")}
            </div>
          </div>
        </section>
      </div>`;
  };
})();
