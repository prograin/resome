(()=>{var i={welcome:"خوش آمدید",title:"آموزش برنامه‌نویسی در اراک",lead:"کلاس خصوصی برنامه‌نویسی، آموزش نیمه‌خصوصی و توسعه نرم‌افزار اختصاصی؛ مسیر یادگیری یا اجرای ایده‌تان را از اینجا شروع کنید.",introTitle:"آموزش و توسعه پروژه",intro:"من احمدرضا رضایی هستم؛ در شهر اراک، استان مرکزی فعالیت می‌کنم و در زمینه آموزش برنامه‌نویسی، طراحی سایت، توسعه بک‌اند و اتوماسیون پروژه انجام می‌دهم. کلاس خصوصی به‌صورت حضوری در اراک یا آنلاین و دوره نیمه‌خصوصی به‌صورت آنلاین برگزار می‌شود.",introEnd:"برای انتخاب کلاس، مقایسه خدمات توسعه یا مطرح‌کردن نیازتان، از مسیرهای زیر شروع کنید.",eyebrow:"توسعه نرم‌افزار · آموزش برنامه‌نویسی",order:"ثبت سفارش پروژه",academy:"ورود به آکادمی",telegram:"پیام در تلگرام",email:"ارسال ایمیل",phone:"تماس مستقیم",stats:["+۲۰ پروژه","+۳ استارتاپ"],cards:{order:"طراحی و پیاده‌سازی پروژه اختصاصی.",academy:"آموزش برنامه‌نویسی از صفر تا انجام پروژه.",contactPage:"پیام برای پروژه، آموزش، مشاوره یا همکاری."},contactPage:"تماس با ما"},d={welcome:"Welcome",title:"Programming training & software development",lead:"Private programming classes in Arak, semi-private online courses and custom software. Find the right path for your next step.",introTitle:"Learn and build with Ahmadreza Rezaei",intro:"I am Ahmadreza Rezaei, based in Arak, Markazi Province, Iran. I teach programming and develop websites, backend systems and automation. Private classes are available in person in Arak or online; semi-private courses are held online.",introEnd:"Explore the classes, compare development services or get in touch to discuss what you need.",eyebrow:"Software development · Programming training",order:"Order a project",academy:"Enter academy",telegram:"Message on Telegram",email:"Send email",phone:"Direct call",stats:["+20 projects","+3 startups"],cards:{order:"Custom software design and development.",academy:"Programming training from zero to real projects.",contactPage:"Message me for projects, training, consulting, or collaboration."},contactPage:"Contact us"};(()=>{"use strict";const s={fa:i,en:d},n=({href:o,label:a,text:e,iconName:t,tone:r,dir:c})=>{const l={"/":"home","/order":"order","/academy":"academy","/contact":"contact-page"},m={cyan:"bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",emerald:"bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",rose:"bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"};return`
      <a href="${o}" data-page-link="${l[o]||"home"}" dir="${c}" class="home-path" data-tone="${r}">
        <span class="icon-tile ${m[r]}">${window.PAGE_SHARED.icon(t)}</span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-slate-950 dark:text-white">${a}</span>
          <span class="mt-1 block text-base leading-6 text-slate-600 dark:text-slate-300">${e}</span>
        </span>
        <span class="home-card-cue">${window.PAGE_SHARED.icon(c==="rtl"?"chevron-left":"chevron-right","h-4 w-4")}</span>
      </a>`};window.PAGE_HOME=function(a="fa"){const e=s[a]||s.fa,t=a==="fa"?"rtl":"ltr";return`
      <div class="home-layout" dir="${t}">
        <section class="home-hero">
          <div class="home-copy">
            <p class="home-eyebrow">${e.eyebrow}</p>
            <div class="home-stats">
              ${e.stats.map(r=>`<span><bdi>${r}</bdi></span>`).join("")}
            </div>
            <p class="home-welcome">${e.welcome}</p>
            <h1>
              ${e.title}
            </h1>
            <p class="home-lead">
              ${e.lead}
            </p>
          </div>

          <div class="home-paths">
            <nav aria-label="${a==="fa"?"مسیرهای اصلی":"Main sections"}">
              ${n({href:"/order",label:e.order,text:e.cards.order,iconName:"folder-kanban",tone:"emerald",dir:t})}
              ${n({href:"/academy",label:e.academy,text:e.cards.academy,iconName:"graduation-cap",tone:"rose",dir:t})}
              ${n({href:"/contact",label:e.contactPage,text:e.cards.contactPage,iconName:"send",tone:"cyan",dir:t})}
            </nav>
          </div>
        </section>
      </div>
      <section class="home-details">
        <h2>${e.introTitle}</h2>
        <p>${e.intro}</p>
        <p>${e.introEnd}</p>
        <nav aria-label="${e.introTitle}">
          <a href="/academy/" data-page-link="academy">${a==="fa"?"کلاس‌های برنامه‌نویسی در اراک":"Programming classes in Arak"}</a>
          <a href="/order/" data-page-link="order">${a==="fa"?"خدمات و پکیج‌های توسعه پروژه":"Project services and packages"}</a>
          <a href="/contact/" data-page-link="contact-page">${a==="fa"?"تماس با مدرس و توسعه‌دهنده":"Contact the instructor and developer"}</a>
        </nav>
      </section>`}})()})();
