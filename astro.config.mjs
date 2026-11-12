import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { titleCase } from './src/lib/format.js';

// Rehype plugin: render in-article subheadings (h2/h3) in acronym-aware Title
// Case, matching the site's headline capitalization. Text inside links or code
// within a heading is left untouched.
function rehypeTitleCaseHeadings() {
  const SKIP = new Set(['a', 'code', 'kbd', 'samp', 'pre']);
  const walk = (node, inHeading) => {
    if (!node) return;
    if (node.type === 'text') {
      if (inHeading) node.value = titleCase(node.value);
      return;
    }
    let h = inHeading;
    if (node.type === 'element') {
      if (/^h[23]$/.test(node.tagName)) h = true;
      if (SKIP.has(node.tagName)) h = false;
    }
    (node.children || []).forEach((c) => walk(c, h));
  };
  return (tree) => walk(tree, false);
}

// Production domain (registered via GoDaddy). Used for canonical URLs, the
// sitemap, and absolute links in the podcast RSS feed. If you serve the site
// from the www subdomain instead, change this to https://www.sacredintel.org.
export default defineConfig({
  site: 'https://sacredintel.org',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeTitleCaseHeadings],
  },
});
