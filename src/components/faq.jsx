import { Icon } from "./icon";
export function Faq({ title, items, dir, className = "" }) {
  return (
    <section className={`faq-section ${className}`}>
      <h2>{title}</h2>
      <div className="faq-list">
        {items.map(([question, answer]) => (
          <details className="faq-item" key={question}>
            <summary>
              {question}
              <Icon name={dir === "rtl" ? "chevron-left" : "chevron-right"} className="h-4 w-4" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
