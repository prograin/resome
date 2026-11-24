import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "../../components/ui/button";
import { LeaderboardTable } from "./leaderboard-table";
import { weeklyCopy } from "./weekly-copy";

export function WeeklyLeaderboard({ weekly, locale }) {
  const copy = weeklyCopy[locale];
  const tabs = [
    { key: "overall", label: copy.overallLeaders, rows: weekly?.leaders },
    { key: "course", label: copy.courseLeaders, rows: weekly?.courseLeaders },
  ];
  return (
    <section className="student-progress__card student-weekly-leaders">
      <h2>{copy.leaders}</h2>
      <Tabs.Root
        defaultValue="overall"
        dir={locale === "fa" ? "rtl" : "ltr"}
        className="student-weekly-leaders__tabs"
      >
        <Tabs.List className="student-weekly-leaders__tab-list" aria-label={copy.leaders}>
          {tabs.map(({ key, label }) => (
            <Tabs.Trigger key={key} value={key} asChild>
              <Button variant="soft">{label}</Button>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {tabs.map(({ key, rows }) => (
          <Tabs.Content key={key} value={key} className="student-weekly-leaders__panel">
            <LeaderboardTable leaders={rows} locale={locale} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </section>
  );
}
