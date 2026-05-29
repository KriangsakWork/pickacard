'use client';

// Configuration for the embedded Sanity Studio mounted at /studio.
// See: https://www.sanity.io/docs/configuration

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool(),
    // Query playground for running GROQ queries inside the Studio.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
