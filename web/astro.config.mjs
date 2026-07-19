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
  rehypeCodeTabs,
} from './src/lib/remark.mjs';

const REPO_URL = 'https://github.com/sb2k16/data-structures-book';

// https://astro.build/config
export default defineConfig({
  // User Pages site serves at the root, so no `base` path is needed. Override
  // SITE_URL at build time if a custom domain is added later.
  site: process.env.SITE_URL ?? 'https://sb2k16.github.io',
  // /support is unlinked while donations are parked; keeping it out of the
  // sitemap stops search from surfacing a page the nav deliberately doesn't.
  integrations: [mdx(), react(), sitemap({ filter: (page) => !page.includes('/support') })],
  vite: { plugins: [tailwind()] },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
    processor: unified({
      remarkPlugins: [remarkStripChapterChrome, remarkMermaid, remarkRewriteLinks],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: 'heading-anchor' } }],
        rehypeWrapTables,
        rehypeCodeTabs,
      ],
    }),
  },
});
