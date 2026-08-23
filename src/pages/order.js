// Project order page template.
(() => {
  "use strict";

  const copy = {
    fa: {
      kicker: "Project Order",
      title: "سفارش پروژه",
      lead: "پروژه شما با قالب آماده یا وردپرس جمع نمی‌شود؛ براساس نیاز محصول، از فریم‌ورک‌هایی مثل Django، Next.js، Nuxt، FastAPI و سرویس‌های مکمل استفاده می‌کنیم. اگر دامنه پروژه بزرگ‌تر باشد، معماری ماژولار یا میکروسرویسی انتخاب می‌شود تا توسعه، نگهداری و رشد سیستم منطقی بماند.",
      email: "شروع سفارش با ایمیل",
      telegram: "پیام در تلگرام",
      phone: "تماس مستقیم",
      cards: [
        ["server", "کدنویسی اختصاصی", "پنل، فروشگاه، API، داشبورد، بک‌اند و فرانت‌اند با ساختاری ساخته می‌شود که دقیقاً به فرآیند شما بخورد.", "emerald"],
        ["lock", "امن‌سازی و پایداری", "احراز هویت، سطح دسترسی، محافظت مسیرها، ذخیره امن داده‌ها، بکاپ و سیو کار از ابتدا در طراحی دیده می‌شود.", "emerald"],
        ["layers", "اتصال سرویس‌ها", "زرین‌پال، اینماد، ملی‌پیامک، اعلان‌ها، Storage، پنل ادمین و سرویس‌های جانبی در صورت نیاز به محصول وصل می‌شوند.", "cyan"],
        ["sparkles", "رابط کاربری مطابق سلیقه", "UI فقط زیبا نیست؛ براساس برند، رفتار کاربر و سلیقه مشتری طراحی می‌شود تا استفاده از محصول راحت و حرفه‌ای باشد.", "violet"],
      ],
    },
    en: {
      kicker: "Project Order",
      title: "Order project",
      lead: "Your project is not forced into WordPress or a ready-made template. Based on the product needs, I use frameworks and services such as Django, Next.js, Nuxt, FastAPI, payment/SMS providers, and admin tooling. Larger products can be designed as modular or microservice-based systems so growth and maintenance stay manageable.",
      email: "Start by email",
      telegram: "Message on Telegram",
      phone: "Direct call",
      cards: [
        ["server", "Custom implementation", "Admin panels, shops, APIs, dashboards, backend and frontend are designed around your real workflow.", "emerald"],
        ["lock", "Security and continuity", "Authentication, permissions, protected routes, safer data handling, backups, and progress preservation are planned from the beginning.", "emerald"],
        ["layers", "Service integrations", "ZarinPal, Enamad, SMS providers, notifications, storage, admin panels, and external services can be connected when needed.", "cyan"],
        ["sparkles", "UI shaped around taste", "The interface follows your brand, customer expectations, and product behavior so it feels polished and usable.", "violet"],
      ],
    },
  };

  const orderCard = ([iconName, title, text, tone], index, icon) => {
    const tones = {
      cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
      emerald:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
      rose: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
      violet:
        "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
    };
    const positions = ["sm:self-end", "sm:self-start", "sm:self-end", "sm:self-start sm:ms-8"];
    const floats = ["float-card-a", "float-card-b", "float-card-c", "float-card-a"];

    return `<div class="float-card ${floats[index]} w-full max-w-none rounded-lg border border-slate-200 bg-white/85 p-4 shadow-softer backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/55 sm:w-[86%] sm:max-w-md ${positions[index]}">
      <span class="inline-flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}">${icon(iconName)}</span>
      <p class="mt-4 text-base font-semibold text-slate-950 dark:text-white sm:text-sm">${title}</p>
      <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">${text}</p>
    </div>`;
  };

  window.PAGE_ORDER = function renderOrderPage(locale = "fa") {
    const { contact, icon, cta } = window.PAGE_SHARED;
    const t = copy[locale] || copy.fa;
    const dir = locale === "fa" ? "rtl" : "ltr";
    const titleClass = locale === "fa" ? "font-[Tahoma] tracking-normal" : "tracking-tight";

    return `
      <div class="box-border flex min-h-[calc(100svh-4rem)] items-center overflow-x-hidden py-4 sm:py-6" dir="${dir}">
        <section class="motion-rise mx-auto flex w-full max-w-6xl flex-col justify-center gap-6 px-4 sm:px-6 lg:px-8">
          <div class="grid w-full items-center gap-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-10">
            <div class="text-center lg:text-start">
              <h1 class="text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl ${titleClass}">
                ${t.title}
              </h1>
              <p class="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base lg:mx-0">
                ${t.lead}
              </p>
              <div class="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
                ${cta(`tel:${contact.phone}`, t.phone, "phone", "emerald")}
                ${cta(`https://t.me/${contact.telegram}`, t.telegram, "send", "cyan", 'target="_blank" rel="noopener noreferrer"')}
              </div>
            </div>

            <div class="flex w-full flex-col items-center gap-3 sm:gap-4" dir="${dir}">
              ${t.cards.map((card, index) => orderCard(card, index, icon)).join("")}
            </div>
          </div>
        </section>
      </div>`;
  };
})();
