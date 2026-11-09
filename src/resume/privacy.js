// privacy behavior for the private portfolio.
export function createPrivacy(context) {
  const { state } = context;
  function privateShareBullets(project) {
    if (Array.isArray(project.shareableDetails) && project.shareableDetails.length) {
      return project.shareableDetails.slice(0, 6);
    }

    const roles = project.roles || [];

    if (state.locale === "fa") {
      const bullets = [
        "این پروژه در محیط واقعی و برای نیاز عملیاتی یک تیم انجام شده است؛ فقط نام ابزارها، ساختار داخلی و اطلاعات حساس نمایش داده نمی‌شود.",
      ];
      if (roles.includes("DataEng")) {
        bullets.push(
          "داده‌های خام را به خروجی قابل استفاده برای گزارش‌گیری، پیگیری وضعیت و تصمیم‌گیری مدیریتی تبدیل کردم.",
        );
      }
      if (roles.includes("Backend")) {
        bullets.push(
          "جریان‌های سمت سرور، منطق دسترسی، اعتبارسنجی و رفتار قابل اتکا برای استفاده روزمره کاربران را طراحی و پیاده‌سازی کردم.",
        );
      }
      if (roles.includes("Frontend") || roles.includes("Fullstack")) {
        bullets.push(
          "در بخش محصول، مسیرهای کاری را ساده‌تر کردم تا کاربر سریع‌تر به اطلاعات یا عملیات مورد نیاز برسد.",
        );
      }
      if (roles.includes("Desktop")) {
        bullets.push(
          "خروجی کار یک ابزار داخلی برای کاهش کارهای دستی، نظم دادن به اطلاعات و سریع‌تر کردن کارهای تکراری بود.",
        );
      }
      return bullets.slice(0, 5);
    }

    const bullets = [
      "Real production work for an operational team; tool names, internal structure, and sensitive details are intentionally hidden.",
    ];
    if (roles.includes("DataEng")) {
      bullets.push(
        "Turned raw operational data into usable reporting, status tracking, and management-facing insight.",
      );
    }
    if (roles.includes("Backend")) {
      bullets.push(
        "Designed and implemented server-side flows, access logic, validation, and reliable day-to-day behavior.",
      );
    }
    if (roles.includes("Frontend") || roles.includes("Fullstack")) {
      bullets.push(
        "Simplified product workflows so users could reach the right information or action faster.",
      );
    }
    if (roles.includes("Desktop")) {
      bullets.push(
        "Delivered an internal tool that reduced manual work, organized information, and sped up repeated tasks.",
      );
    }
    return bullets.slice(0, 5);
  }

  return { privateShareBullets };
}
