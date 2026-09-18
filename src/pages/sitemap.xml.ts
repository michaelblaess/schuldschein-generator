import type { APIRoute } from 'astro';
import { DOMAIN, PFADE, type SeitenSchluessel } from '../lib/i18n';
import { lastmod } from '../lib/lastmod';

export const GET: APIRoute = () => {
  const eintraege = (Object.keys(PFADE) as SeitenSchluessel[]).flatMap((seite) => {
    const datum = lastmod(seite);
    const alternativen = (['de', 'en'] as const)
      .map((s) => `    <xhtml:link rel="alternate" hreflang="${s}" href="${DOMAIN}${PFADE[seite][s]}"/>`)
      .join('\n');
    return (['de', 'en'] as const).map((s) => `  <url>
    <loc>${DOMAIN}${PFADE[seite][s]}</loc>
    <lastmod>${datum}</lastmod>
${alternativen}
    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${PFADE[seite].de}"/>
  </url>`);
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${eintraege.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
