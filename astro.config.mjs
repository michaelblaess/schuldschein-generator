import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Minimal Astro config; Styling via CDN in Base layout.
export default defineConfig({
  server: { port: 4321 },
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: true })]
});
