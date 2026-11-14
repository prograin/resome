import { assetUrl } from "../config/assets";
import Link from "next/link";
export default function NotFound() {
  return (
    <>
      <link rel="stylesheet" precedence="site" href={assetUrl("/styles/error.css")} />
      <main className="error-page">
        <p className="error-code">۴۰۴</p>
        <h1>این صفحه پیدا نشد</h1>
        <p>ممکن است آدرس تغییر کرده باشد. از صفحه اصلی یا مسیرهای زیر ادامه بدهید.</p>
        <nav aria-label="مسیرهای جایگزین">
          <Link prefetch={false} href="/">
            صفحه اصلی
          </Link>
          <Link prefetch={false} href="/academy/">
            آموزش برنامه‌نویسی
          </Link>
          <Link prefetch={false} href="/contact/">
            تماس با ما
          </Link>
        </nav>
      </main>
    </>
  );
}
