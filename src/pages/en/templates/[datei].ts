import type { APIRoute } from 'astro';
import { dateiAntwort, dateiPfade } from '../../../lib/vorlagen-dateien';

export const getStaticPaths = () => dateiPfade('en');

export const GET: APIRoute = ({ props }) => dateiAntwort('en', props as Parameters<typeof dateiAntwort>[1]);
