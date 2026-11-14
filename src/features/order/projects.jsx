import Image from "next/image";
import { assetUrl } from "../../config/assets";
import { Icon } from "../../components/icon";
import { projects } from "./projects-data";

export function Projects({ locale, dir }) {
  const title = locale === "fa" ? "نمونه‌کارها" : "Selected work";
  const visit = locale === "fa" ? "مشاهده سایت" : "Visit website";
  return (
    <section className="project-showcase" aria-labelledby="publicProjectsTitle">
      <header className="project-showcase__header">
        <h2 id="publicProjectsTitle" className="project-showcase__title">
          <Icon name="folder-kanban" className="h-4 w-4" />
          {title}
        </h2>
      </header>
      <div className="project-showcase__grid">
        {projects.map((project) => (
          <a
            key={project.href}
            className="project-showcase__item"
            data-project-tone={project.tone}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name[locale]} — ${visit}`}
          >
            <span className="project-showcase__logo" aria-hidden="true">
              <Image
                unoptimized
                src={assetUrl(project.logo)}
                alt=""
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
              />
            </span>
            <h3 dir="auto">{project.name[locale]}</h3>
            <span className="project-showcase__visit">
              {visit}
              <Icon name={dir === "rtl" ? "chevron-left" : "chevron-right"} className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
