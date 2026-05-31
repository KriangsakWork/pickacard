import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(145deg, #1C1033 0%, #2E1A4E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
          <path
            d="M17 1 L19.2 14.8 L33 17 L19.2 19.2 L17 33 L14.8 19.2 L1 17 L14.8 14.8 Z"
            fill="#B8A5E8"
          />
        </svg>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
