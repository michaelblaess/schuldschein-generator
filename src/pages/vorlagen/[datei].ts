import type { APIRoute } from 'astro';
import { dateiAntwort, dateiPfade } from '../../lib/vorlagen-dateien';

export const getStaticPaths = () => dateiPfade('de');

export const GET: APIRoute = ({ props }) => dateiAntwort('de', props as Parameters<typeof dateiAntwort>[1]);
