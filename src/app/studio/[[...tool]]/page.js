/**
 * Embedded Sanity Studio, served at /studio.
 *
 * The catch-all [[...tool]] route lets the Studio handle its own client-side
 * routing. Admin pages should never be indexed by search engines.
 */

import { NextStudio } from 'next-sanity/studio';

import config from '../../../../sanity.config';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Pick Mystic Studio',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
