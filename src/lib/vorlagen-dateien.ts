import { erzeugeDocx } from './docx';
import type { Sprache } from './i18n';
import { erzeugePdf } from './pdf';
import { erzeugeVertrag, leereAngaben } from './vertrag';
import { VORLAGEN } from './vorlagen';

/** Pfade fuer getStaticPaths: je Vorlage eine PDF- und eine DOCX-Datei. */
export function dateiPfade(sprache: Sprache) {
  return VORLAGEN[sprache].flatMap((v) => (['pdf', 'docx'] as const).map((endung) => ({
    params: { datei: `${v.datei}.${endung}` },
    props: { fassung: v.fassung, endung, titel: v.titel },
  })));
}

const TYP = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/** Baut die leere Vorlage beim Bauen der Seite als Datei. */
export async function dateiAntwort(sprache: Sprache, props: ReturnType<typeof dateiPfade>[number]['props']): Promise<Response> {
  const bausteine = erzeugeVertrag(leereAngaben(), props.fassung, sprache, true);
  const titel = `${sprache === 'de' ? 'Schuldschein' : 'Promissory note'} - ${props.titel}`;
  const bytes = props.endung === 'pdf' ? await erzeugePdf(bausteine, titel) : await erzeugeDocx(bausteine, titel);
  return new Response(bytes, { headers: { 'Content-Type': TYP[props.endung] } });
}
