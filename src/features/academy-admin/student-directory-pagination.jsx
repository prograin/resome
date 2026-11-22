import { SiteLink } from "../../components/site-link";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";

export function StudentDirectoryPagination({ page, pages, pageLink, copy, numbers, locale }) {
  const rtl = locale === "fa";
  const start = Math.max(1, Math.min(page - 1, pages - 2));
  const visible = [
    ...new Set([1, ...Array.from({ length: Math.min(3, pages) }, (_, i) => start + i), pages]),
  ].sort((a, b) => a - b);
  const items = visible.flatMap((value, index) =>
    index && value - visible[index - 1] > 1 ? [`gap-${value}`, value] : [value],
  );
  return (
    <nav className="academy-admin__pagination" aria-label={`${copy.directory} · ${copy.page}`}>
      <span className="academy-admin__pagination-summary">
        {copy.page} {numbers.format(page)} {copy.of} {numbers.format(pages)}
      </span>
      <div className="academy-admin__pagination-controls">
        <Button
          className="academy-admin__pagination-previous"
          as={page > 1 ? SiteLink : "button"}
          href={page > 1 ? pageLink(page - 1) : undefined}
          disabled={page === 1}
          variant="soft"
          aria-label={copy.previous}
          title={copy.previous}
        >
          <Icon name={rtl ? "chevron-right" : "chevron-left"} />
        </Button>
        <div className="academy-admin__pagination-pages">
          {items.map((item) =>
            typeof item === "string" ? (
              <span key={item} aria-hidden="true">
                …
              </span>
            ) : (
              <Button
                as={SiteLink}
                key={item}
                href={pageLink(item)}
                variant={item === page ? "primary" : "soft"}
                aria-current={item === page ? "page" : undefined}
                aria-label={`${copy.page} ${numbers.format(item)}`}
              >
                {numbers.format(item)}
              </Button>
            ),
          )}
        </div>
        <Button
          className="academy-admin__pagination-next"
          as={page < pages ? SiteLink : "button"}
          href={page < pages ? pageLink(page + 1) : undefined}
          disabled={page === pages}
          variant="soft"
          aria-label={copy.next}
          title={copy.next}
        >
          <Icon name={rtl ? "chevron-left" : "chevron-right"} />
        </Button>
      </div>
    </nav>
  );
}
