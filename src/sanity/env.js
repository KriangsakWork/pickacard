// Reads Sanity-related environment variables and validates that the
// required ones are present. Values come from .env.local (see README/setup).

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
);

function assertValue(v, errorMessage) {
  // Trim stray whitespace/newlines that can sneak in when pasting values into
  // a hosting provider's env UI (a trailing newline makes Sanity reject the
  // projectId). Treat an empty/whitespace-only value as missing.
  const value = typeof v === 'string' ? v.trim() : v;

  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
}
