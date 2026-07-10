import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';

/**
 * The book's markdown stays the single source of truth in ../chapters. The site
 * is a build target over it, so a chapter edit shows up on the web without a
 * copy step and the GitHub repo never drifts from the published book.
 *
 * No schema: the chapters carry no frontmatter. Their titles, ordering, and
 * blurbs live in src/lib/book.ts so the repo's markdown stays plain GitHub
 * markdown, readable without a build step.
 */
const chapters = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: '../chapters',
    generateId: ({ entry }) => entry.replace(/^\d+(\.\d+)?-/, '').replace(/\.md$/, ''),
  }),
});

export const collections = { chapters };
