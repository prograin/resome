import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";
import content from "../../content/academy/learning-paths.json";

export function LearningPaths({ locale, dir }) {
  const { title, paths } = content[locale];
  const { open } = useDetailsDialog();

  function showDetails({ title: pathTitle, steps, branches, note }) {
    open({
      kind: "public-academy",
      kicker: title,
      title: pathTitle,
      content: (
        <div className="learning-path__details" dir={dir}>
          {steps && (
            <ol>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
          {branches?.map(({ title, description }) => (
            <section className="learning-path__branch" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </section>
          ))}
          {note && <p className="learning-path__note">{note}</p>}
        </div>
      ),
    });
  }

  return (
    <section className="learning-paths" aria-labelledby="learning-paths-title">
      <div className="learning-paths__inner">
        <h2 id="learning-paths-title">{title}</h2>
        <div className="learning-paths__cards">
          {paths.map((path) => (
            <article className="learning-path" key={path.title}>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <Button variant="soft" aria-haspopup="dialog" onClick={() => showDetails(path)}>
                {path.action}
                <Icon name={dir === "rtl" ? "chevron-left" : "chevron-right"} />
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
