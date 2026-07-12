/**
 * Chapters are authored as standalone GitHub markdown, so each one opens with a
 * hand-maintained "Table of Contents" list and an H1 that repeats the title.
 * On the web both are chrome the layout already provides. Strip them rather
 * than editing 21 files and desyncing the repo from the site.
 */
export function remarkStripChapterChrome() {
  return (tree) => {
    const children = tree.children;
    const out = [];
    let i = 0;

    // Leading H1: the layout renders the title from the manifest.
    if (children[0]?.type === 'heading' && children[0].depth === 1) i = 1;

    while (i < children.length) {
      const node = children[i];
      const isTocHeading =
        node.type === 'heading' &&
        node.depth === 2 &&
        node.children?.[0]?.value?.trim().toLowerCase() === 'table of contents';

      if (isTocHeading) {
        i++;
        // Swallow the list (and any blank paragraphs) up to the next heading.
        while (i < children.length && children[i].type !== 'heading') i++;
        continue;
      }
      out.push(node);
      i++;
    }
    tree.children = out;
  };
}

/**
 * Shiki has no `mermaid` grammar and would throw. Hand these blocks to the
 * client-side renderer instead, wrapped so a wide diagram scrolls inside its
 * own box rather than pushing the page sideways.
 */
export function remarkMermaid() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type !== 'code' || node.lang !== 'mermaid' || !parent) return;
      parent.children[index] = {
        type: 'html',
        value: `<div class="mermaid-wrap"><pre class="mermaid">${escapeHtml(node.value)}</pre></div>`,
      };
    });
  };
}

/**
 * Chapter links point at sibling `.md` files and at `../examples/...` in the
 * repo. Rewrite the first to site routes and the second to GitHub, so no link
 * in 188,000 words 404s.
 */
export function remarkRewriteLinks() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type !== 'link' || typeof node.url !== 'string') return;
      const url = node.url;
      // The markdown chapters use absolute site URLs so links also work when
      // read on GitHub. On the site, strip the domain so they're relative and
      // survive a domain change (and never look like leaving the site).
      const siteMatch = url.match(/^https?:\/\/sb2k16\.github\.io(\/[^\s]*)?$/i);
      if (siteMatch) {
        node.url = siteMatch[1] || '/';
        return;
      }
      // Leave alone: external, mailto, in-page anchors, and absolute site paths
      // (e.g. /chapters/foo written directly in MDX).
      if (/^(https?:|mailto:|#|\/)/.test(url)) return;

      const chapterMatch = url.match(/^(?:\.\/|\.\.\/chapters\/)?(\d+(?:\.\d+)?)-([a-z0-9-]+)\.md(#.*)?$/i);
      if (chapterMatch) {
        const [, num, name, hash = ''] = chapterMatch;
        node.url = `/chapters/${num === '3.6' || num === '03.6' ? 'memory-hierarchy' : name}${hash}`;
        return;
      }
      // Everything else is a relative repo path (examples/, docs/, LICENSE) that
      // has no on-site page. Readers should never be bounced off the site to
      // "browse for details", so unwrap the link and keep only its text.
      if (parent && typeof index === 'number' && Array.isArray(node.children)) {
        parent.children.splice(index, 1, ...node.children);
      }
    });
  };
}

/**
 * The chapters contain wide comparison tables that push a 390px viewport
 * sideways. Markdown emits a bare <table> with nowhere to scroll, so give each
 * one its own horizontally scrollable box. Runs on hast, after markdown → HTML.
 */
export function rehypeWrapTables() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type !== 'element' || node.tagName !== 'table' || !parent) return;
      if (parent.type === 'element' && parent.properties?.className?.includes?.('table-scroll')) return;
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [node],
      };
    });
  };
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
}

function visit(node, fn, index, parent) {
  fn(node, index, parent);
  if (!node.children) return;
  // Backwards so an in-place replacement can't shift the indices we haven't visited.
  for (let i = node.children.length - 1; i >= 0; i--) visit(node.children[i], fn, i, node);
}
