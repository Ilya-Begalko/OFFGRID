# OFFGRID

Independent journal about men's style, urban culture and contemporary brands.

**Style outside the lines.**

A single-page Vue 3 editorial site. Content lives in TypeScript files; photographs are stored locally. There is no backend, CMS, router or store.

## Stack

- Vue 3 (Composition API) + TypeScript
- Vite
- Tailwind CSS
- VueUse Motion
- Lucide Vue Next
- GitHub Actions → GitHub Pages

## Local development

```bash
npm ci
npm run dev
```

Other scripts:

```bash
npm run type-check
npm run build
npm run preview
```

Do not use a local production build to publish the site. Publication happens only through GitHub Actions.

## Publish

The site is a project GitHub Pages site at `/OFFGRID/`. The public base path is centralised in `vite.config.ts` (`SITE_BASE`, falling back to `/OFFGRID/`).

On every push to `main` (or via **Run workflow**):

1. Install with `npm ci`
2. Type-check
3. Production build
4. Deploy `dist/` with official GitHub Pages actions

In the repository: **Settings → Pages → Source → GitHub Actions**.

## Content

Editorial copy is in `src/data/`:

- `stories.ts` — six journal pieces
- `fits.ts` — four city outfits
- `brands.ts` — six labels on the watchlist
- `categories.ts` — shared filters

Photographs: `public/images/`. Paths are resolved with `import.meta.env.BASE_URL` via `src/utils/asset.ts`.

Images are from [Unsplash](https://unsplash.com/license) and [Pexels](https://www.pexels.com/license/). They are used editorially and do not imply endorsement by the people or brands pictured.
