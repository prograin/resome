export function UpdateMarkup() {
  return (
    <dialog
      id="siteUpdateDialog"
      className="site-update-dialog"
      aria-labelledby="siteUpdateTitle"
      aria-describedby="siteUpdateDescription"
    >
      <span className="site-update__symbol" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 7v5h-5M4 17v-5h5" />
          <path d="M6 7a7 7 0 0 1 12-2l2 2M18 17a7 7 0 0 1-12 2l-2-2" />
        </svg>
      </span>
      <h2 id="siteUpdateTitle">نسخه جدید سایت آماده است</h2>
      <p id="siteUpdateDescription">برای دیدن آخرین تغییرات و عکس‌ها، سایت را بروزرسانی کنید.</p>
      <div className="site-update__actions">
        <button id="siteUpdateApply" type="button">
          بروزرسانی
        </button>
        <button id="siteUpdateLater" type="button">
          بعداً
        </button>
      </div>
    </dialog>
  );
}
