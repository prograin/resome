// hero behavior for the private portfolio.
export function createHero(context) {
  const { state, getData, refreshIcons } = context;
  function renderTop() {
    const DATA = getData();

    const navName = context.$("#navName");
    if (navName && navName.tagName !== "IMG") {
      navName.textContent = "Ahmadreza Rezaei";
    }
    const heroKicker = context.$("#heroKicker");
    if (heroKicker) {
      const kickerText = DATA.ui?.heroKicker || "";
      heroKicker.textContent = kickerText;
      heroKicker.classList.toggle("hidden", !kickerText);
    }
    context.$("#heroName").textContent = DATA.personal.name || "";
    context.$("#heroTitle").textContent = DATA.personal.title || "";
    context.$("#heroSummary").textContent = DATA.personal.about || "";
    const heroSummaryMobile = context.$("#heroSummaryMobile");
    if (heroSummaryMobile) {
      heroSummaryMobile.textContent = state.heroExpanded
        ? DATA.personal.about || ""
        : DATA.personal.mobileAbout || DATA.personal.about || "";
    }

    const heroSummaryToggle = context.$("#heroSummaryToggle");
    const heroSummaryToggleText = context.$("#heroSummaryToggleText");
    if (heroSummaryToggle && heroSummaryToggleText) {
      heroSummaryToggleText.textContent = state.heroExpanded
        ? DATA.ui?.buttons?.showLess || "Show less"
        : DATA.ui?.buttons?.showMore || "Show more";
      heroSummaryToggle.setAttribute("aria-expanded", state.heroExpanded ? "true" : "false");
    }

    const availabilityTitle = context.$("#heroAvailabilityTitle");
    const availabilityText = context.$("#heroAvailabilityText");
    if (availabilityTitle) {
      availabilityTitle.textContent =
        DATA.ui?.heroAvailabilityTitle ||
        (state.locale === "fa" ? "آماده همکاری" : "Available for work");
    }
    if (availabilityText) {
      availabilityText.textContent =
        DATA.ui?.heroAvailabilityText ||
        (state.locale === "fa"
          ? "بک‌اند، داده، فول‌استک و یادگیری ماشین"
          : "Backend, data, full-stack, and ML");
    }

    const heroNumber = context.$("#heroNumber");
    if (heroNumber) heroNumber.textContent = DATA.personal.number || "";
    const heroPhone = context.$("#heroPhone");
    if (heroPhone) {
      heroPhone.href = DATA.personal.number ? `tel:${DATA.personal.number}` : "#";
    }
    const heroLocation = context.$("#heroLocation");
    if (heroLocation) heroLocation.textContent = DATA.personal.location || "";

    const emailEl = context.$("#heroEmail");
    const emailTextEl = context.$("#heroEmailText");
    if (emailEl) {
      if (emailTextEl) emailTextEl.textContent = DATA.personal.email || "";
      else emailEl.textContent = DATA.personal.email || "";
      emailEl.href = DATA.personal.email ? `mailto:${DATA.personal.email}` : "#";
    }

    const modesEl = document.getElementById("heroWorkModes");
    if (modesEl) {
      const modes = Array.isArray(DATA.personal.workModes)
        ? DATA.personal.workModes.join(" / ")
        : "";
      modesEl.textContent = modes || DATA.personal.employmentType || "";
    }

    const rolesHint = context.$("#rolesHint");
    if (rolesHint) {
      const hint = DATA.ui?.rolesHint || "";
      rolesHint.textContent = hint;
      rolesHint.classList.toggle("hidden", !hint);
    }
    const contactHint = context.$("#contactHint");
    if (contactHint) {
      const hint = DATA.ui?.contactHint || "";
      contactHint.textContent = hint;
      contactHint.classList.toggle("hidden", !hint);
    }

    const cvBtn = context.$("#cvBtn");
    if (cvBtn) cvBtn.href = DATA.ui?.cvUrl || "#";

    const socialLinks = [
      context.linkPill("GitHub", DATA.personal.links?.github, "github"),
      context.linkPill("LinkedIn", DATA.personal.links?.linkedin, "linkedin"),
      context.linkPill("Instagram", DATA.personal.links?.instagram, "instagram"),
      context.linkPill("YouTube", DATA.personal.links?.youtube, "youtube"),
      context.linkPill(
        "Email",
        DATA.personal.email ? `mailto:${DATA.personal.email}` : "#",
        "mail",
      ),
      context.linkPill(
        state.locale === "fa" ? "تماس مستقیم" : "Direct call",
        DATA.personal.number ? `tel:${DATA.personal.number}` : "#",
        "phone",
      ),
      context.linkPill("Contact", "/contact", "send"),
    ].join("");

    const heroLinks = context.$("#heroLinks");
    if (heroLinks) {
      heroLinks.innerHTML = "";
      heroLinks.classList.add("hidden");
    }

    const contactLinks = context.$("#contactLinks");
    if (contactLinks) contactLinks.innerHTML = socialLinks;

    /*
    context.$("#contactLinks").innerHTML = [
      context.contactCard(
        state.locale === "fa" ? "ایمیل" : "Email",
        DATA.personal.email ? `mailto:${DATA.personal.email}` : "#",
        state.locale === "fa" ? "ارسال ایمیل" : "Send email",
        "mail",
      ),
      context.contactCard(
        state.locale === "fa" ? "موقعیت" : "Location",
        "#",
        DATA.personal.location || "",
        "map-pin",
      ),
      context.contactCard(
        state.locale === "fa" ? "نوع همکاری" : "Work modes",
        "#",
        Array.isArray(DATA.personal.workModes)
          ? DATA.personal.workModes.join(" / ")
          : DATA.personal.employmentType || "",
        "briefcase-business",
      ),
      context.contactCard(
        state.locale === "fa" ? "شماره تماس" : "Phone",
        DATA.personal.number ? `tel:${DATA.personal.number}` : "#",
        state.locale === "fa" ? "تماس مستقیم" : "Direct call",
        "phone",
      ),
      context.contactCard(
        "GitHub",
        DATA.personal.links?.github || "#",
        state.locale === "fa" ? "مشاهده کدها" : "View code",
        "github",
      ),
      context.contactCard(
        "LinkedIn",
        DATA.personal.links?.linkedin || "#",
        state.locale === "fa" ? "پروفایل کاری" : "Professional profile",
        "linkedin",
      ),
      context.contactCard(
        "Instagram",
        DATA.personal.links?.instagram || "#",
        state.locale === "fa" ? "پیام در اینستاگرام" : "Message on Instagram",
        "instagram",
      ),
      context.contactCard(
        "YouTube",
        DATA.personal.links?.youtube || "#",
        state.locale === "fa" ? "مشاهده ویدیوها" : "Watch videos",
        "youtube",
      ),
    ].join("");

    context.$("#contactLinks")
      ?.querySelectorAll('[data-lucide="map-pin"], [data-lucide="briefcase-business"]')
      .forEach((icon) => icon.closest("a")?.remove());
    */

    refreshIcons();
  }

  return { renderTop };
}
