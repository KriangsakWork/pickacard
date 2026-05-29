// Slugify that preserves Thai (and other unicode) letters instead of stripping
// them the way the default ASCII slugifier does. Lowercases, turns whitespace
// into dashes, drops punctuation, and keeps unicode letters/numbers + dashes.
// Editors can always override the generated slug by hand in the Studio.
export function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
}
