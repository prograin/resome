import { Icon } from "../../components/icon";
export default function Section() {
  return (
    <>
      <section
        id="education"
        className="my-8 rounded-lg border border-violet-100/80 bg-violet-50/40 p-5 dark:border-violet-950/70 dark:bg-violet-950/15 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200">
            <Icon name="graduation-cap" className="h-5 w-5" />
          </div>
          <h2
            id="titleEducation"
            className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            Education
          </h2>
        </div>

        <div id="educationList" className="mt-6 grid gap-4 sm:grid-cols-2"></div>
      </section>
    </>
  );
}
