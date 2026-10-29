/** Resolves a path from `public/` against the deploy base (e.g. `/OFFGRID/`). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

export function scrollToSection(id: string): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
