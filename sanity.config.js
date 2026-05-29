'use client';

// Configuration for the embedded Sanity Studio mounted at /studio.
// See: https://www.sanity.io/docs/configuration

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemas';

// Document type that should exist as a single, fixed document.
const SINGLETONS = ['homepagePicks'];

// Custom desk structure: group document types and pin Homepage Picks as a
// singleton (edit the one document instead of creating many).
const structure = (S) =>
  S.list()
    .title('Pick Mystic')
    .items([
      S.listItem()
        .title('Content')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('article').title('Articles'),
              S.documentTypeListItem('category').title('Categories'),
            ])
        ),
      S.listItem()
        .title('Commerce')
        .child(
          S.list()
            .title('Commerce')
            .items([S.documentTypeListItem('product').title('Products')])
        ),
      S.listItem()
        .title('Settings')
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Homepage Picks')
                .id('homepagePicks')
                .child(
                  S.document()
                    .schemaType('homepagePicks')
                    .documentId('homepagePicks')
                ),
            ])
        ),
    ]);

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  document: {
    // Prevent create/duplicate/delete on singletons so only one stays.
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(
            ({ action }) =>
              !['duplicate', 'delete', 'unpublish'].includes(action)
          )
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    // Query playground for running GROQ queries inside the Studio.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
