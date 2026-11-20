export function AcademyHero({ locale, title, lead, children }) {
  return (
    <section className="academy-hero">
      <div className="academy-hero__copy">
        <h1 className={locale === "fa" ? "tracking-normal" : "tracking-tight"}>{title}</h1>
        <p>{lead}</p>
        {children && <div className="academy-hero__actions">{children}</div>}
      </div>
    </section>
  );
}
