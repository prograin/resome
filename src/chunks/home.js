(()=>{var c={title:"خوش آمدید",lead:"برای کسب‌وکارتان نرم‌افزار اختصاصی می‌خواهید یا می‌خواهید برنامه‌نویسی یاد بگیرید؟ از طراحی و اجرای پروژه‌های نرم‌افزاری تا آموزش خصوصی و نیمه‌خصوصی، همراه شما هستم.",introTitle:"از یادگیری برنامه‌نویسی تا اجرای ایده‌ها",intro:"من احمدرضا رضایی هستم؛ مدرس برنامه‌نویسی و توسعه‌دهنده نرم‌افزار. در طراحی سایت، توسعه بک‌اند و اتوماسیون فرایندها به کسب‌وکارها کمک می‌کنم و تجربه‌ام را در کلاس‌های خصوصی و نیمه‌خصوصی با علاقه‌مندان به برنامه‌نویسی به اشتراک می‌گذارم.",introClasses:"کلاس‌های خصوصی به‌صورت حضوری در اراک یا آنلاین و دوره‌های نیمه‌خصوصی به‌صورت آنلاین برگزار می‌شوند.",introEnd:"برای یادگیری برنامه‌نویسی، سفارش پروژه یا دریافت مشاوره، از اینجا شروع کنید.",introLinks:{academy:"آموزش برنامه‌نویسی",order:"طراحی و توسعه نرم‌افزار",contact:"تماس با من"},eyebrow:"توسعه نرم‌افزار · اجرای پروژه · آموزش برنامه‌نویسی",order:"ثبت سفارش پروژه",academy:"ورود به آکادمی",telegram:"پیام در تلگرام",email:"ارسال ایمیل",phone:"تماس مستقیم",stats:["+۲۰ پروژه","+۵ استارتاپ"],cards:{order:"طراحی و پیاده‌سازی پروژه اختصاصی.",academy:"آموزش برنامه‌نویسی از صفر تا انجام پروژه.",contactPage:"پیام برای پروژه، آموزش، مشاوره یا همکاری."},contactPage:"تماس با ما"},d={title:"Welcome",lead:"Need custom software for your business or want to learn programming? From designing and building software projects to private and semi-private training, I am here to help.",introTitle:"Learn and build with Ahmadreza Rezaei",intro:"I am Ahmadreza Rezaei, based in Arak, Markazi Province, Iran. I teach programming and develop websites, backend systems and automation.",introClasses:"Private classes are available in person in Arak or online; semi-private courses are held online.",introEnd:"Explore the classes, compare development services or get in touch to discuss what you need.",introLinks:{academy:"Programming classes in Arak",order:"Project services and packages",contact:"Contact the instructor and developer"},eyebrow:"Software development · Project delivery · Programming education",order:"Order a project",academy:"Enter academy",telegram:"Message on Telegram",email:"Send email",phone:"Direct call",stats:["+20 projects","+5 startups"],cards:{order:"Custom software design and development.",academy:"Programming training from zero to real projects.",contactPage:"Message me for projects, training, consulting, or collaboration."},contactPage:"Contact us"};(()=>{"use strict";const s={fa:c,en:d},o=({href:n,label:t,text:e,iconName:a,tone:r,dir:i})=>{const l={"/":"home","/order":"order","/academy":"academy","/contact":"contact-page"},m={cyan:"bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",emerald:"bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",rose:"bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"};return`
      <a href="${n}" data-page-link="${l[n]||"home"}" dir="${i}" class="home-path" data-tone="${r}">
        <span class="icon-tile ${m[r]}">${window.PAGE_SHARED.icon(a)}</span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-slate-950 dark:text-white">${t}</span>
          <span class="mt-1 block text-base leading-6 text-slate-600 dark:text-slate-300">${e}</span>
        </span>
        <span class="home-card-cue">${window.PAGE_SHARED.icon(i==="rtl"?"chevron-left":"chevron-right","h-4 w-4")}</span>
      </a>`};window.PAGE_HOME=function(t="fa"){const e=s[t]||s.fa,a=t==="fa"?"rtl":"ltr";return`
      <div class="home-layout" dir="${a}">
        <section class="home-hero">
          <div class="home-copy">
            <p class="home-eyebrow">${e.eyebrow}</p>
            <div class="home-stats">
              ${e.stats.map(r=>`<span><bdi>${r}</bdi></span>`).join("")}
            </div>
            <h1>
              ${e.title}
            </h1>
            <p class="home-lead">
              ${e.lead}
            </p>
          </div>

          <div class="home-paths">
            <nav aria-label="${t==="fa"?"مسیرهای اصلی":"Main sections"}">
              ${o({href:"/order",label:e.order,text:e.cards.order,iconName:"folder-kanban",tone:"emerald",dir:a})}
              ${o({href:"/academy",label:e.academy,text:e.cards.academy,iconName:"graduation-cap",tone:"rose",dir:a})}
              ${o({href:"/contact",label:e.contactPage,text:e.cards.contactPage,iconName:"send",tone:"cyan",dir:a})}
            </nav>
          </div>
        </section>
      </div>
      <section class="home-details">
        <h2>${e.introTitle}</h2>
        <p>${e.intro}</p>
        <p>${e.introClasses}</p>
        <p>${e.introEnd}</p>
        <nav aria-label="${e.introTitle}">
          <a href="/academy/" data-page-link="academy">${e.introLinks.academy}</a>
          <a href="/order/" data-page-link="order">${e.introLinks.order}</a>
          <a href="/contact/" data-page-link="contact-page">${e.introLinks.contact}</a>
        </nav>
      </section>`}})()})();
