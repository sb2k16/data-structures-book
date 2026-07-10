// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {
  remarkStripChapterChrome,
  remarkMermaid,
  remarkRewriteLinks,
  rehypeWrapTables,
} from './src/lib/remark.mjs';

const REPO_URL = 'https://github.com/sb2k16/data-structures-book';

// https://astro.build/config
export default defineConfig({
  site: 'https://realhardware.dev',
  integrations: [mdx(), react(), sitemap()],
  vite: { plugins: [tailwind()] },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
    processor: unified({
      remarkPlugins: [remarkStripChapterChrome, remarkMermaid, [remarkRewriteLinks, REPO_URL]],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: 'heading-anchor' } }],
        rehypeWrapTables,
      ],
    }),
  },
});
