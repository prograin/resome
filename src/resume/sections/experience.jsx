import { Icon } from "../../components/icon";
export default function Section() {
  return (
    <>
      <section
        id="experience"
        className="my-8 rounded-lg border border-emerald-100/80 bg-emerald-50/40 p-5 dark:border-emerald-950/70 dark:bg-emerald-950/15 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            <Icon name="briefcase" className="h-5 w-5" />
          </div>
          <h2
            id="titleExperience"
            className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            Experience
          </h2>
        </div>

        <div id="experienceList" className="mt-6 space-y-4"></div>
      </section>
    </>
  );
}
