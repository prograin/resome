import { Icon } from "../../components/icon";
export default function HeroSection({ name }) {
  return (
    <>
      <section id="resumeHome" className="pb-4 pt-10 sm:pb-5 sm:pt-14">
        <div className="rounded-lg border border-cyan-100/80 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-cyan-950/70 dark:bg-slate-950/45 sm:p-8 lg:p-10">
          <div>
            <p
              id="heroKicker"
              className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300"
            ></p>
            <h1
              id="heroName"
              className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl"
            >
              {name}
            </h1>
            <p
              id="heroTitle"
              className="mt-4 max-w-4xl text-base font-semibold leading-7 text-cyan-900 dark:text-cyan-100 sm:text-xl"
            ></p>
            <p
              id="heroSummary"
              className="mt-5 hidden max-w-4xl whitespace-pre-line text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:block"
            ></p>
            <p
              id="heroSummaryMobile"
              className="mt-5 max-w-4xl text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:hidden"
            ></p>
            <button
              id="heroSummaryToggle"
              className="mt-2 text-sm font-semibold text-cyan-700 underline underline-offset-4 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100 sm:hidden"
              type="button"
              aria-expanded="false"
            >
              <span id="heroSummaryToggleText"></span>
            </button>

            <div
              id="heroLinks"
              className="resume-hero-left mt-6 flex flex-wrap items-center justify-start gap-3 text-left"
              dir="ltr"
            ></div>
          </div>
        </div>
      </section>
    </>
  );
}
