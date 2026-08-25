// Project order page template.
(() => {
  "use strict";

  const copy = {
    fa: {
      kicker: "Project Order",
      title: "سفارش پروژه",
      lead: "هر کسب‌وکار نیازهای متفاوتی دارد؛ به همین دلیل به جای استفاده از راه‌حل‌های تکراری، ساختار هر پروژه براساس هدف، کاربران و مسیر رشد آن طراحی می‌شود.\n\nبا استفاده از تکنولوژی‌هایی مانند Django، Next.js، Nuxt و FastAPI، سیستم‌هایی سریع، امن و قابل توسعه ساخته می‌شوند که بتوانند در کنار رشد کسب‌وکار شما توسعه پیدا کنند. برای پروژه‌های بزرگ‌تر نیز معماری‌های ماژولار و میکروسرویس انتخاب می‌شوند تا نگهداری، توسعه و مقیاس‌پذیری محصول در آینده ساده‌تر باشد.",
      email: "شروع سفارش با ایمیل",
      telegram: "پیام در تلگرام",
      phone: "تماس مستقیم",
      contactPage: "تماس با ما",
      pricingTitle: "انتخاب پکیج",
      activeLabel: "پکیج فعال",
      packages: [
        {
          title: "سایت شرکتی",
          price: "20 میلیون تومان",
          fit: "مناسب برای شرکت‌ها و برندهایی که نیاز به معرفی خدمات دارند.",
          icon: "layout",
          tone: "sky",
          features: [
            "طراحی UI اختصاصی",
            "صفحه اصلی حرفه‌ای (Landing Page)",
            "صفحات معرفی شرکت، خدمات، تماس با ما",
            "بخش نمونه‌کارها",
            "بخش مقالات / وبلاگ",
            "فرم تماس",
            "بهینه‌سازی اولیه SEO",
            "طراحی ریسپانسیو موبایل و دسکتاپ",
            "پنل مدیریت محتوا ساده",
          ],
        },
        {
          title: "فروشگاه اینترنتی",
          price: "30 میلیون تومان",
          fit: "مناسب برای کسب‌وکارهای کوچک که نیاز به فروش آنلاین ساده دارند.",
          icon: "tag",
          tone: "emerald",
          featured: true,
          features: [
            "طراحی فروشگاه اختصاصی",
            "مدیریت محصولات",
            "دسته‌بندی محصولات",
            "جستجوی محصولات",
            "سبد خرید",
            "ثبت سفارش",
            "پنل کاربری مشتری",
            "ورود و ثبت‌نام کاربران",
            "احراز هویت پایه",
            "اتصال درگاه پرداخت",
            "مدیریت سفارش‌ها",
            "مدیریت موجودی کالا",
            "آپلود تصاویر محصولات",
            "پنل مدیریت متوسط",
            "طراحی UI استاندارد",
          ],
        },
        {
          title: "فروشگاه اینترنتی حرفه‌ای",
          price: "50 میلیون تومان",
          fit: "مناسب برای فروشگاه‌هایی که امکانات کامل‌تر و مدیریت حرفه‌ای نیاز دارند.",
          icon: "server",
          tone: "cyan",
          features: [
            "تمام امکانات نسخه کوچک +",
            "طراحی UI/UX حرفه‌ای",
            "داشبورد مدیریت پیشرفته",
            "سیستم نقش‌ها و دسترسی ادمین",
            "مدیریت چند ادمین",
            "سیستم مقاله و بلاگ",
            "سیستم نظرات کاربران",
            "امتیازدهی محصولات",
            "مقایسه محصولات",
            "فیلتر حرفه‌ای محصولات",
            "اتصال Gmail Authentication",
            "ورود پیامکی",
            "ساخت فاکتور PDF",
            "گزارش فروش",
            "گزارش کاربران",
            "اتصال زرین‌پال",
            "سیستم تخفیف پیشرفته",
            "مدیریت کمپین فروش",
            "بارگذاری ویدیو محصول",
            "SEO پیشرفته‌تر",
          ],
        },
        {
          title: "ربات تلگرام",
          price: "30 میلیون تومان",
          fit: "مناسب برای اتوماسیون ارتباط با کاربران تلگرام.",
          icon: "send",
          tone: "amber",
          features: [
            "طراحی Telegram Bot",
            "منوی دکمه‌ای",
            "پاسخ خودکار",
            "دریافت اطلاعات کاربر",
            "ارسال پیام اطلاع‌رسانی",
            "اتصال API ساده",
            "بات تلگرام ساده",
          ],
        },
        {
          title: "بات تلگرامی حرفه‌ای",
          price: "+35 میلیون تومان",
          fit: "مناسب برای سیستم‌های بزرگ‌تر با نیاز به مدیریت داده.",
          icon: "database",
          tone: "violet",
          features: [
            "Database",
            "مدیریت کاربران",
            "پروفایل کاربران",
            "ذخیره تاریخچه تعاملات",
            "پنل مدیریت",
            "ارسال پیام گروهی",
            "سیستم عضویت",
            "سیستم پرداخت",
            "اتصال به سایت",
            "گزارش‌گیری",
            "مدیریت سفارش از طریق بات",
          ],
        },
        {
          title: "ربات اینستاگرام",
          price: "15 میلیون تومان",
          fit: "مناسب برای اتوماسیون سبک اینستاگرام و مدیریت ارتباط اولیه.",
          icon: "instagram",
          tone: "rose",
          features: [
            "پاسخ خودکار دایرکت",
            "مدیریت پیام‌های پرتکرار",
            "ارسال اطلاعات محصول/خدمات",
            "اتصال API ساده",
          ],
        },
      ],
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
      contactPage: "Contact us",
      pricingTitle: "Packages",
      activeLabel: "Active package",
      packages: [
        {
          title: "Corporate website",
          price: "20 million Toman",
          fit: "Best for companies and brands that need to present their services.",
          icon: "layout",
          tone: "sky",
          features: [
            "Custom UI design",
            "Professional landing page",
            "Company, services, and contact pages",
            "Portfolio section",
            "Articles / blog section",
            "Contact form",
            "Initial SEO optimization",
            "Responsive mobile and desktop design",
            "Simple content management panel",
          ],
        },
        {
          title: "Online store",
          price: "30 million Toman",
          fit: "Best for small businesses that need a simple online sales flow.",
          icon: "tag",
          tone: "emerald",
          featured: true,
          features: [
            "Custom store design",
            "Product management",
            "Product categories",
            "Product search",
            "Shopping cart",
            "Order placement",
            "Customer user panel",
            "User login and registration",
            "Basic authentication",
            "Payment gateway integration",
            "Order management",
            "Inventory management",
            "Product image upload",
            "Medium admin panel",
            "Standard UI design",
          ],
        },
        {
          title: "Professional online store",
          price: "50 million Toman",
          fit: "Best for shops that need richer commerce and professional management.",
          icon: "server",
          tone: "cyan",
          features: [
            "Everything in the small package +",
            "Professional UI/UX design",
            "Advanced admin dashboard",
            "Admin roles and permissions",
            "Multi-admin management",
            "Article and blog system",
            "User comments system",
            "Product rating",
            "Product comparison",
            "Advanced product filters",
            "Gmail Authentication integration",
            "SMS login",
            "PDF invoice creation",
            "Sales report",
            "User report",
            "ZarinPal integration",
            "Advanced discount system",
            "Sales campaign management",
            "Product video upload",
            "More advanced SEO",
          ],
        },
        {
          title: "Telegram bot",
          price: "30 million Toman",
          fit: "Best for automating communication with Telegram users.",
          icon: "send",
          tone: "amber",
          features: [
            "Telegram Bot design",
            "Button menu",
            "Automated reply",
            "User information collection",
            "Notification messaging",
            "Simple API integration",
            "Simple Telegram bot",
          ],
        },
        {
          title: "Professional Telegram bot",
          price: "+35 million Toman",
          fit: "Best for larger systems that need data and user management.",
          icon: "database",
          tone: "violet",
          features: [
            "Database",
            "User management",
            "User profiles",
            "Interaction history storage",
            "Admin panel",
            "Group messaging",
            "Membership system",
            "Payment system",
            "Website integration",
            "Reporting",
            "Order management through the bot",
          ],
        },
        {
          title: "Instagram bot",
          price: "15 million Toman",
          fit: "Best for light Instagram automation and first-response workflows.",
          icon: "instagram",
          tone: "rose",
          features: [
            "Automated direct replies",
            "Frequent message management",
            "Product/service information sending",
            "Simple API integration",
          ],
        },
      ],
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

  const packageCard = (pkg, index, t, icon) => {
    const active = pkg.featured ? " is-active" : "";
    return `<article class="pricing-card${active}" data-pricing-card="${index}" data-tone="${pkg.tone || "cyan"}" aria-label="${pkg.title}">
      <div class="pricing-card__top">
        <span class="pricing-card__icon">${icon(pkg.icon, "h-5 w-5")}</span>
        <span class="pricing-card__badge" aria-hidden="true">0${index + 1}</span>
      </div>
      <h3 class="pricing-card__title">${pkg.title}</h3>
      <p class="pricing-card__price">${pkg.price}</p>
      <p class="pricing-card__fit">${pkg.fit}</p>
      <ul class="pricing-card__features">
        ${pkg.features.map((feature) => `<li>${icon("check-circle-2", "h-4 w-4")}<span>${feature}</span></li>`).join("")}
      </ul>
    </article>`;
  };

  const packageTab = (pkg, index) => {
    const active = pkg.featured ? " is-active" : "";
    return `<button class="pricing-tab${active}" type="button" data-pricing-tab="${index}" data-tone="${pkg.tone || "cyan"}" aria-selected="${pkg.featured ? "true" : "false"}">
      <span class="pricing-tab__number" aria-hidden="true">0${index + 1}</span>
      ${pkg.title}
    </button>`;
  };

  function updatePricingNav(panel, index, total) {
    panel.querySelectorAll("[data-pricing-nav]").forEach((button) => {
      const step = Number(button.dataset.pricingNav);
      const nextIndex = index + step;
      button.disabled = nextIndex < 0 || nextIndex >= total;
    });
  }

  function activatePricingCard(carousel, index, shouldScroll = false) {
    const panel = carousel.closest(".pricing-panel") || document;
    const cards = Array.from(carousel.querySelectorAll("[data-pricing-card]"));
    const tabs = Array.from(panel.querySelectorAll("[data-pricing-tab]"));
    const activeCard = cards[index] || cards[0];
    if (!activeCard) return;
    const activeIndex = Number(activeCard.dataset.pricingCard);

    cards.forEach((card) => {
      const isActive = card === activeCard;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-current", isActive ? "true" : "false");
    });

    tabs.forEach((tab) => {
      const isActive = Number(tab.dataset.pricingTab) === activeIndex;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    updatePricingNav(panel, activeIndex, cards.length);

    if (shouldScroll) {
      activeCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  function setActivePricingCard(carousel) {
    const cards = Array.from(carousel.querySelectorAll("[data-pricing-card]"));
    if (!cards.length) return;

    const activeIndex = Math.max(
      0,
      cards.findIndex((card) => card.classList.contains("is-active")),
    );
    activatePricingCard(carousel, activeIndex);
  }

  function initPricingCarousel(root = document) {
    root.querySelectorAll("[data-pricing-carousel]").forEach((carousel) => {
      if (carousel.dataset.pricingReady === "true") {
        setActivePricingCard(carousel);
        return;
      }

      carousel.dataset.pricingReady = "true";
      const update = () => setActivePricingCard(carousel);

      window.addEventListener("resize", update);
      carousel
        .closest(".pricing-panel")
        ?.querySelectorAll("[data-pricing-tab]")
        .forEach((tab) => {
          tab.addEventListener("click", () => {
            activatePricingCard(
              carousel,
              Number(tab.dataset.pricingTab),
              !window.matchMedia("(width < 48rem)").matches,
            );
          });
        });
      carousel
        .closest(".pricing-panel")
        ?.querySelectorAll("[data-pricing-nav]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            const cards = Array.from(
              carousel.querySelectorAll("[data-pricing-card]"),
            );
            const activeIndex = Math.max(
              0,
              cards.findIndex((card) => card.classList.contains("is-active")),
            );
            const nextIndex = Math.min(
              cards.length - 1,
              Math.max(0, activeIndex + Number(button.dataset.pricingNav)),
            );
            activatePricingCard(carousel, nextIndex, true);
          });
        });

      const preferred = carousel.querySelector(".pricing-card.is-active");
      if (preferred) {
        window.requestAnimationFrame(() => {
          if (!window.matchMedia("(width < 48rem)").matches) {
            preferred.scrollIntoView({
              behavior: "auto",
              block: "nearest",
              inline: "center",
            });
          }
          update();
        });
      } else {
        update();
      }
    });
  }

  window.PAGE_ORDER_INIT = initPricingCarousel;

  window.PAGE_ORDER = function renderOrderPage(locale = "fa") {
    const { icon, cta } = window.PAGE_SHARED;
    const t = copy[locale] || copy.fa;
    const dir = locale === "fa" ? "rtl" : "ltr";
    const titleClass = locale === "fa" ? "font-[Tahoma] tracking-normal" : "tracking-tight";
    const rightNavStep = dir === "rtl" ? -1 : 1;
    const leftNavStep = dir === "rtl" ? 1 : -1;
    const rightNavLabel = dir === "rtl" ? "Previous package" : "Next package";
    const leftNavLabel = dir === "rtl" ? "Next package" : "Previous package";

    return `
      <div class="box-border flex min-h-[calc(100svh-4rem)] items-center overflow-x-hidden py-4 sm:py-6" dir="${dir}">
        <section class="motion-rise mx-auto flex w-full max-w-6xl flex-col justify-center gap-6 px-4 sm:px-6 lg:px-8">
          <div class="grid w-full items-center gap-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-10">
            <div class="text-center lg:text-start">
              <h1 class="text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl ${titleClass}">
                ${t.title}
              </h1>
              <p class="mx-auto mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base lg:mx-0">
                ${t.lead}
              </p>
              <div class="order-contact-cta mx-auto mt-5 flex w-full max-w-md lg:mx-0 lg:max-w-xs">
                ${cta("#contact-page", t.contactPage, "send", "cyan")}
              </div>
            </div>

            <div class="flex w-full flex-col items-center gap-3 sm:gap-4" dir="${dir}">
              ${t.cards.map((card, index) => orderCard(card, index, icon)).join("")}
            </div>
          </div>

            <div class="pricing-panel" dir="${dir}">
            <div class="pricing-panel__header">
              <div>
                <h2>${t.pricingTitle}</h2>
              </div>
            </div>

            <div class="pricing-tabs" role="tablist" aria-label="Packages">
              ${t.packages.map((pkg, index) => packageTab(pkg, index)).join("")}
            </div>

            <div class="pricing-carousel-shell">
              <button class="pricing-nav pricing-nav--right" type="button" data-pricing-nav="${rightNavStep}" aria-label="${rightNavLabel}">
                ${icon("arrow-right", "h-5 w-5")}
              </button>
              <div class="pricing-carousel" data-pricing-carousel>
                ${t.packages.map((pkg, index) => packageCard(pkg, index, t, icon)).join("")}
              </div>
              <button class="pricing-nav pricing-nav--left" type="button" data-pricing-nav="${leftNavStep}" aria-label="${leftNavLabel}">
                ${icon("arrow-left", "h-5 w-5")}
              </button>
            </div>
          </div>
        </section>
      </div>`;
  };
})();
