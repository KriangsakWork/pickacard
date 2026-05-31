export const SITE_URL = 'https://pickmystic.com';

// Truncate at the last whitespace before max, append ellipsis.
// Thai text often has no spaces, so we hard-cut as a last resort.
export function truncate(str, max) {
  if (!str) return '';
  const s = String(str).trim();
  if (s.length <= max) return s;
  const sliced = s.slice(0, max);
  const lastSpace = sliced.lastIndexOf(' ');
  const cut = lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trimEnd()}…`;
}

export const META_TITLE_MAX = 60;
export const META_DESC_MAX = 160;

// Build a Next metadata.alternates object that sets both canonical and
// the th-TH hreflang to the same path. metadataBase resolves relative paths.
export function alternatesFor(path) {
  return {
    canonical: path,
    languages: { 'th-TH': path },
  };
}

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

// Flatten portable text spans inside a block into plain string.
function blockToText(block) {
  if (!block || block._type !== 'block' || !Array.isArray(block.children)) return '';
  return block.children.map((c) => c.text || '').join('').trim();
}

// Extract FAQ pairs from a Sanity portable text body. A heading block
// (h2/h3) ending with "?" is treated as a question; subsequent normal
// blocks until the next heading become the answer.
export function extractFaqFromBody(body) {
  if (!Array.isArray(body)) return [];
  const faqs = [];
  let current = null;
  for (const b of body) {
    if (b._type !== 'block') continue;
    const style = b.style;
    const text = blockToText(b);
    if (!text) continue;
    const isHeading = style === 'h2' || style === 'h3';
    if (isHeading) {
      if (current && current.answer) faqs.push(current);
      const isQuestion = /[?？]\s*$/.test(text);
      current = isQuestion ? { question: text, answer: '' } : null;
    } else if (current) {
      current.answer = current.answer ? `${current.answer} ${text}` : text;
    }
  }
  if (current && current.answer) faqs.push(current);
  return faqs;
}

export function faqPageLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
