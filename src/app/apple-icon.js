import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: 'linear-gradient(145deg, #1C1033 0%, #2E1A4E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Card shape — tilted ~-12deg like the logo */}
        <div
          style={{
            width: 76,
            height: 98,
            border: '3.5px solid #B8A5E8',
            borderRadius: 11,
            background: 'rgba(184, 165, 232, 0.12)',
            transform: 'rotate(-12deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 4-pointed sparkle star */}
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path
              d="M17 1 L19.2 14.8 L33 17 L19.2 19.2 L17 33 L14.8 19.2 L1 17 L14.8 14.8 Z"
              fill="#B8A5E8"
            />
          </svg>
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
