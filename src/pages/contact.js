// Contact page template.
(() => {
  "use strict";

  const copy = {
    fa: {
      eyebrow: "ارتباط سریع",
      title: "بیایید شروع کنیم",
      lead: "برای پروژه، آموزش، مشاوره یا همکاری، از طریق راه‌های زیر پیام دهید. درخواست شما را بررسی می‌کنم و در کوتاه‌ترین زمان پاسخ می‌دهم.",
      telegram: "شروع گفتگو در تلگرام",
      phone: "تماس مستقیم",
      email: "ارسال ایمیل",
      linkedin: "لینکدین",
      responseTitle: "زمان پاسخ‌گویی",
      responseText: "معمولاً در کوتاه‌ترین زمان ممکن پاسخ می‌دهم.",
      note: "در حین تماس نوع درخواست خود را با نیازتان بنویسید.",
    },
    en: {
      eyebrow: "Quick contact",
      title: "Let's Start",
      lead: "For projects, training, consulting, or collaboration, message me through one of the channels below. I will review your request and respond as soon as possible.",
      telegram: "Start on Telegram",
      phone: "Direct call",
      email: "Send email",
      linkedin: "LinkedIn",
      responseTitle: "Response time",
      responseText: "I usually respond as soon as possible.",
      note: "When you reach out, include your request type and what you need.",
    },
  };

  const action = (href, label, iconName, tone, icon, attrs = "") => `
    <a class="contact-action contact-action--${tone}" href="${href}" ${attrs}>
      ${icon(iconName, "h-4 w-4")}
      <span>${label}</span>
    </a>`;

  window.PAGE_CONTACT = function renderContactPage(locale = "fa") {
    const { contact, icon } = window.PAGE_SHARED;
    const t = copy[locale] || copy.fa;
    const dir = locale === "fa" ? "rtl" : "ltr";
    const titleClass =
      locale === "fa" ? "font-[Tahoma] tracking-normal" : "tracking-tight";

    return `
      <div class="contact-page" dir="${dir}">
        <section class="contact-shell motion-rise">
          <div class="contact-visual" aria-hidden="true">
            ${Array.from({ length: 18 }, (_, index) => `<span style="--i:${index}"></span>`).join("")}
          </div>

          <div class="contact-hero">
            <h1 class="${titleClass}">${t.title}</h1>
            <p>${t.lead}</p>
          </div>

          <div class="contact-geo" aria-hidden="true">
            ${Array.from({ length: 9 }, (_, index) => `<span style="--i:${index}"></span>`).join("")}
          </div>

          <div class="contact-link-grid">
            <div class="contact-actions">
              ${action(`tel:${contact.phone}`, t.phone, "phone", "secondary", icon)}
              ${action(`https://t.me/${contact.telegram}`, t.telegram, "telegram", "primary", icon, 'target="_blank" rel="noopener noreferrer"')}
              ${action(contact.linkedin, t.linkedin, "linkedin", "linkedin", icon, 'target="_blank" rel="noopener noreferrer"')}
              ${action(`mailto:${contact.email}`, t.email, "mail", "email", icon)}
            </div>
          </div>

          <div class="contact-orbit" aria-hidden="true"></div>

          <div class="contact-final-stack">
            <span class="contact-final-stack__mark">${icon("lightbulb", "h-12 w-12")}</span>
            <h2>${t.note}</h2>
            <p>${t.responseText}</p>
          </div>

        </section>
      </div>`;
  };
})();
