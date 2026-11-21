/* Public offline shell only; it contains no account or dashboard data. */
self.academyOfflineResponse = () => new Response(`<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#142237"><title>Prograin Academy — آفلاین</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:1.5rem;background:#142237;color:#edf3fd;font-family:Tahoma,Arial,sans-serif;text-align:center;line-height:2}
main{max-width:30rem}svg{width:5rem;height:5rem;color:#68e7c0}h1{font-size:1.35rem}p{color:#b5c3d8}a{display:inline-block;margin-top:1rem;padding:.7rem 1.7rem;border-radius:.8rem;background:#087b72;color:white;text-decoration:none}a:focus-visible{outline:2px solid #68e7c0;outline-offset:4px}
</style></head><body><main>
<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><path d="m32 10 24 11-24 11L8 21l24-11ZM16 26v13c9 7 23 7 32 0V26M19 47l-6 5 6 5m26-10 6 5-6 5m-10-12-6 14"/></svg>
<h1>اتصال به اینترنت برقرار نیست</h1>
<p>برای ورود به آکادمی و دیدن آخرین اطلاعات، اتصال اینترنتتان را بررسی کنید و دوباره تلاش کنید.</p>
<p lang="en" dir="ltr">You're offline. Reconnect to access Prograin Academy.</p>
<a href="/academy/students/">تلاش دوباره</a>
</main></body></html>`, {
  status: 200,
  headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  },
});
