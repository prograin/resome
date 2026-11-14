import { Icon } from "../../components/icon";
export default function Section() {
  return (
    <>
      <section
        id="skills"
        className="my-8 rounded-lg border border-rose-100/80 bg-rose-50/40 p-5 dark:border-rose-950/70 dark:bg-rose-950/15 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200">
            <Icon name="sparkles" className="h-5 w-5" />
          </div>
          <h2
            id="titleSkills"
            className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            Skills
          </h2>
        </div>

        <div id="skillsGrid" className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"></div>
      </section>
    </>
  );
}
