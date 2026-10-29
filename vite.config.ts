import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// Single source of truth for the public base path.
// GitHub Actions passes the Pages base path via SITE_BASE; locally it falls back to the project-site path.
const base = process.env.SITE_BASE || '/OFFGRID/';

export default defineConfig({
  base: base.endsWith('/') ? base : `${base}/`,
  plugins: [vue(), tailwindcss()]
});
