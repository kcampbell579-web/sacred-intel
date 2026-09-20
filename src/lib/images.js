import fs from 'node:fs';
import path from 'node:path';

// Resolve a photo from /public/img at build time. Drop a file named
// <slug>.jpg (or .png/.webp) into public/img/articles/ and it appears
// automatically — no frontmatter edit needed. Returns null if absent so
// components can fall back to generated cover art.
const PUB = path.resolve('public');
const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
// Accepts <slug>.jpg or a size-suffixed 16:9 file (<slug>-1600x900.jpg etc.),
// so images exported from the shot-list drop straight in.
const SUFFIXES = ['', '-1600x900', '-1920x1080', '-16x9'];

function findIn(dir, slug) {
  for (const suf of SUFFIXES) {
    for (const e of EXTS) {
      const rel = `img/${dir}/${slug}${suf}.${e}`;
      if (fs.existsSync(path.join(PUB, rel))) return '/' + rel;
    }
  }
  return null;
}

export function articleImage(slug) {
  return findIn('articles', slug);
}

export function episodeImage(slug) {
  return findIn('episodes', slug);
}

// Site-level image by filename (e.g. "series-deep-dives.jpg"); returns
// "/img/<name>" if present, else null.
export function siteImage(name) {
  return fs.existsSync(path.join(PUB, 'img', name)) ? `/img/${name}` : null;
}
