// Generate share cards from real site assets; no external image service required.
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";
import { loadPages } from "./lib/render.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const { SITE_CONFIG } = await loadPages(root);
const font = (await readFile(path.join(root, "assets/fonts/Vazirmatn-Variable.woff2"))).toString(
  "base64",
);
const logo = (await readFile(path.join(root, "assets/icons/icon-192.png"))).toString("base64");
const directory = path.join(root, "assets/images/social");
await mkdir(directory, { recursive: true });
const cards = {
  home: [
    "آموزش برنامه‌نویسی در اراک",
    "توسعه نرم‌افزار اختصاصی",
    "از یادگیری تا اجرای ایده",
    "#67e8cd",
  ],
  academy: [
    "آموزش برنامه‌نویسی",
    "از مبانی تا اجرای پروژه",
    "کلاس خصوصی در اراک و آنلاین · دوره نیمه‌خصوصی",
    "#c4b5fd",
  ],
  order: ["ایده شما،", "یک پروژه اختصاصی", "طراحی سایت · توسعه بک‌اند · اتوماسیون", "#7dd3fc"],
  contact: [
    "بیایید درباره",
    "قدم بعدی صحبت کنیم",
    "آموزش برنامه‌نویسی · سفارش پروژه · مشاوره",
    "#67e8cd",
  ],
};
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  for (const [key, [first, second, subtitle, color]] of Object.entries(cards)) {
    await page.setContent(`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><style>
      @font-face{font-family:Vazirmatn;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#081523;font-family:Vazirmatn;color:#f1f5f9;width:1200px;height:630px;padding:52px 72px;overflow:hidden;background-image:radial-gradient(ellipse at 5% 0%,#123c47,transparent 62%)}header{display:flex;align-items:center;gap:18px}header img{width:64px;height:64px}header strong{font-size:36px;letter-spacing:-1px}main{margin-top:36px}h1{font-size:62px;line-height:1.55;letter-spacing:0;margin:0;font-weight:800}h1 span{color:${color}}p{color:#bccddd;font-size:25px;margin-top:18px}footer{display:flex;align-items:center;justify-content:space-between;margin-top:34px;color:#93adc1;font-size:20px}footer b{color:#deebf6;font-weight:500}.mark{position:absolute;left:72px;top:145px;font-size:200px;opacity:.04;font-weight:900;color:${color};direction:ltr}
    </style></head><body><header><img src="data:image/png;base64,${logo}" alt=""><strong dir="ltr">prograin<span style="color:${color}">.</span></strong></header><div class="mark">&lt;/&gt;</div><main><h1>${first}<br><span>${second}</span></h1><p>${subtitle}</p></main><footer><b>احمدرضا رضایی · ${SITE_CONFIG.location.label.fa}</b><span dir="ltr">${new URL(SITE_CONFIG.origin).hostname}</span></footer></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(directory, `${key}.jpg`), type: "jpeg", quality: 88 });
    console.log(`Generated ${key}.jpg (1200 × 630)`);
  }
} finally {
  await browser.close();
}
