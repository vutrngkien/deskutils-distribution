export type Crumb = { label: string; href?: string };

/**
 * Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by
 * the page (see `content/structured-data.ts`), so this stays presentational.
 */
export function Breadcrumbs({ items, tone = 'dark' }: { items: Crumb[]; tone?: 'dark' | 'light' }) {
  return (
    <nav
      data-track-placement="breadcrumb"
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-2 text-[14px] ${
        tone === 'light' ? 'text-white/70' : 'text-muted'
      }`}
    >
      {items.map((crumb, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
            {crumb.href && !last ? (
              <a
                href={crumb.href}
                className={tone === 'light' ? 'hover:text-white' : 'hover:text-primary'}
              >
                {crumb.label}
              </a>
            ) : (
              <span className={tone === 'light' ? 'text-white' : 'text-base-content'}>
                {crumb.label}
              </span>
            )}
            {!last && <span aria-hidden="true">›</span>}
          </span>
        );
      })}
    </nav>
  );
}
