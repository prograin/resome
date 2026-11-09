(()=>{"use strict";const s={fa:{eyebrow:"ارتباط سریع",title:"بیایید شروع کنیم",lead:"برای پروژه، آموزش، مشاوره یا همکاری، از طریق راه‌های زیر پیام دهید. درخواست شما را بررسی می‌کنم و در کوتاه‌ترین زمان پاسخ می‌دهم.",telegram:"شروع گفتگو در تلگرام",phone:"تماس مستقیم",email:"ارسال ایمیل",linkedin:"لینکدین",responseTitle:"زمان پاسخ‌گویی",responseText:"معمولاً در کوتاه‌ترین زمان ممکن پاسخ می‌دهم.",note:"از ایده و نیازتان بنویسید؛ با هم مسیرش را پیدا می‌کنیم."},en:{eyebrow:"Quick contact",title:"Let's Start",lead:"For projects, training, consulting, or collaboration, message me through one of the channels below. I will review your request and respond as soon as possible.",telegram:"Start on Telegram",phone:"Direct call",email:"Send email",linkedin:"LinkedIn",responseTitle:"Response time",responseText:"I usually respond as soon as possible.",note:"When you reach out, include your request type and what you need."}},o=(c,t,a,n,e,i="")=>`
    <a class="contact-action contact-action--${n}" href="${c}" ${i}>
      ${e(a,"h-4 w-4")}
      <span>${t}</span>
      <span class="contact-action__cue">${e(document.documentElement.dir==="rtl"?"chevron-left":"chevron-right","h-4 w-4")}</span>
    </a>`;window.PAGE_CONTACT=function(t="fa"){const{contact:a,icon:n}=window.PAGE_SHARED,e=s[t]||s.fa,i=t==="fa"?"rtl":"ltr",l=t==="fa"?"tracking-normal":"tracking-tight";return`
      <div class="contact-page" dir="${i}">
        <section class="contact-shell contact-shell--centered">
          <div class="contact-hero">
            <p class="contact-location">${n("map-pin","h-4 w-4")}<bdi dir="${i}">${window.SITE_CONFIG.location.label[t]||window.SITE_CONFIG.location.label.fa}</bdi></p>
            <h1 class="${l}">${e.title}</h1>
            <p>${e.lead}</p>
          </div>

          <div class="contact-link-grid">
            <div class="contact-actions">
              ${o(`https://t.me/${a.telegram}`,e.telegram,"telegram","primary",n,'target="_blank" rel="noopener noreferrer"')}
              ${o(`tel:${a.phone}`,e.phone,"phone","secondary",n)}
              ${o(`mailto:${a.email}`,e.email,"mail","email",n)}
              ${o(a.linkedin,e.linkedin,"linkedin","linkedin",n,'target="_blank" rel="noopener noreferrer"')}
            </div>
          </div>

          <div class="contact-final-stack">
            <span class="contact-final-stack__mark">${n("lightbulb","h-12 w-12")}</span>
            <h2>${e.note}</h2>
            <p>${e.responseText}</p>
          </div>

        </section>
      </div>`}})();
