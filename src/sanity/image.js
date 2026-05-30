import { createImageUrlBuilder } from '@sanity/image-url';

import { client } from './client';

const builder = createImageUrlBuilder(client);

// Helper to build a CDN URL for a Sanity image asset reference.
// Usage: urlFor(source).width(800).url()
export function urlFor(source) {
  return builder.image(source);
}
