import { Icon } from "../../components/icon";
export default function Section() {
  return (
    <>
      <section
        id="filters"
        className="mb-8 mt-3 rounded-lg border border-cyan-100/80 bg-cyan-50/45 p-4 dark:border-cyan-950/70 dark:bg-cyan-950/15 sm:mt-4 sm:p-5"
      >
        <div className="rounded-lg border border-slate-200 bg-white/85 p-5 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 sm:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
                  <Icon name="filter" className="h-5 w-5" />
                </div>
                <div>
                  <h2
                    id="titleRoles"
                    className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
                  >
                    Roles
                  </h2>

                  <p
                    id="rolesHint"
                    className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300"
                  ></p>
                </div>
              </div>

              <div id="roleChips" className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
