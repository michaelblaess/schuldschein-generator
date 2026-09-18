import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://schuldschein-generator.de',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Astro 7 schneidet sonst Leerzeichen zwischen Inline-Elementen weg
  compressHTML: true,
  vite: { plugins: [tailwindcss()] },
});
