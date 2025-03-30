import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import type { PageTree } from 'fumadocs-core/server';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
