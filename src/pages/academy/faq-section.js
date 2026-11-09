import faqs from "../../content/academy/faq.json";

export function academyFaq(locale = "fa") {
  return window.PAGE_SHARED.faq(
    locale === "fa" ? "پرسش‌های رایج درباره آموزش برنامه‌نویسی" : "Programming training questions",
    faqs[locale] || faqs.fa,
    "academy-faq-section",
  );
}
