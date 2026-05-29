import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from './env';

// Client used to fetch data from Sanity in the Next.js app.
// useCdn: true serves cached, faster responses for published content.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
