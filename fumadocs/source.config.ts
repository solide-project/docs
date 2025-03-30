import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      'adi.editUrl': z.string().optional()
    })
  }
});

export const ides = defineDocs({
  dir: 'content/ide',
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
