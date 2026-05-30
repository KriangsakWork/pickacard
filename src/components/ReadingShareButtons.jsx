'use client';

import { useState } from 'react';

// Social share + save-image buttons for the reading detail page.
// Mirrors ArticleShareButtons.js styling, but swaps the "copy link" pill for
// a "save image" pill that rasterizes `captureRef` via html2canvas.
export default function ReadingShareButtons({ title = '', slug = '', captureRef }) {
  const [busy, setBusy] = useState(false);

  const enc = encodeURIComponent;
  const currentUrl = () =>
    typeof window !== 'undefined' ? window.location.href : '';

  const openShare = (build) => {
    const href = build(currentUrl());
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const shareText = `${title} | Pick Mystic`;
  const toFacebook = (u) =>
    `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`;
  const toX = (u) =>
    `https://twitter.com/intent/tweet?url=${enc(u)}&text=${enc(shareText)}`;
  const toLine = (u) =>
    `https://social-plugins.line.me/lineit/share?url=${enc(u)}`;

  // Fetch a cross-origin image via CORS and return a data URL so html2canvas
  // can rasterize it without tainting the canvas. Falls back to the original
  // src on failure so the image just shows as-is in the snapshot.
  async function toDataUrl(url) {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  async function saveImage() {
    if (busy) return;
    const node = captureRef?.current;
    if (!node) return;
    setBusy(true);
    const restore = [];
    try {
      const { default: html2canvas } = await import('html2canvas');

      // 1. Wait for current images to load.
      const imgs = Array.from(node.querySelectorAll('img'));
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete && img.naturalWidth > 0) return resolve();
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            }),
        ),
      );

      // 2. Swap each cross-origin <img> src to a data URL so the canvas
      // is not tainted when html2canvas reads pixel data.
      await Promise.all(
        imgs.map(async (img) => {
          const src = img.currentSrc || img.src;
          if (!src || src.startsWith('data:')) return;
          try {
            const dataUrl = await toDataUrl(src);
            restore.push([img, img.src, img.srcset]);
            img.removeAttribute('srcset');
            img.src = dataUrl;
            await new Promise((resolve) => {
              if (img.complete && img.naturalWidth > 0) return resolve();
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            });
          } catch {
            // Leave original src; html2canvas may still skip it.
          }
        }),
      );

      if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch {}
      }

      const canvas = await html2canvas(node, {
        backgroundColor: '#F5F0FA',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      const ts = Date.now();
      a.href = dataUrl;
      a.download = `pick-mystic-${slug || 'reading'}-${ts}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('save image failed:', err);
      alert('เกิดข้อผิดพลาดในการสร้างภาพ ลองใหม่อีกครั้ง');
    } finally {
      // Restore original src/srcset so the visible UI keeps next/image
      // optimizations after the capture finishes.
      for (const [img, src, srcset] of restore) {
        if (srcset) img.srcset = srcset;
        if (src) img.src = src;
      }
      setBusy(false);
    }
  }

  const iconBtn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="text-sm font-medium text-muted-purple">แชร์ผลทำนาย:</span>

      <button
        type="button"
        aria-label="แชร์ไปยัง Facebook"
        onClick={() => openShare(toFacebook)}
        className={`${iconBtn} bg-[#1877F2]`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="แชร์ไปยัง X"
        onClick={() => openShare(toX)}
        className={`${iconBtn} bg-black`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="แชร์ไปยัง Line"
        onClick={() => openShare(toLine)}
        className={`${iconBtn} bg-[#06C755]`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 5.69 2 10.24c0 4.08 3.55 7.5 8.35 8.14.32.07.77.21.88.49.1.25.07.64.03.9l-.14.85c-.04.25-.2.99.87.54 1.07-.45 5.75-3.39 7.85-5.8C21.3 13.66 22 12.04 22 10.24 22 5.69 17.52 2 12 2ZM8.13 12.62H6.16a.52.52 0 0 1-.52-.52V8.16a.52.52 0 1 1 1.04 0v3.42h1.45a.52.52 0 1 1 0 1.04Zm2.04-.52a.52.52 0 1 1-1.04 0V8.16a.52.52 0 1 1 1.04 0v3.94Zm4.6 0a.52.52 0 0 1-.36.5.55.55 0 0 1-.16.02.52.52 0 0 1-.42-.21l-2.02-2.75v2.44a.52.52 0 1 1-1.04 0V8.16a.52.52 0 0 1 .93-.31l2.02 2.75V8.16a.52.52 0 1 1 1.05 0v3.94Zm3.3-2.49a.52.52 0 1 1 0 1.04h-1.45v.93h1.45a.52.52 0 1 1 0 1.04h-1.97a.52.52 0 0 1-.52-.52V8.16a.52.52 0 0 1 .52-.52h1.97a.52.52 0 1 1 0 1.04h-1.45v.93h1.45Z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={saveImage}
        disabled={busy}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/30 bg-white px-4 text-sm font-medium text-primary transition-colors hover:bg-primary-50 disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {busy ? 'กำลังบันทึก...' : 'บันทึกรูป'}
      </button>
    </div>
  );
}
