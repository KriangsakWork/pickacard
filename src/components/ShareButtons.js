'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';

function cardSlug(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '-');
}

function stripEmoji(s) {
  // Remove pictographic emoji (Unicode property escape)
  return (s || '').replace(/\p{Extended_Pictographic}/gu, '').replace(/\s+/g, ' ').trim();
}

export default function ShareButtons({ topicTitle, reading, onReset }) {
  const shareRef = useRef(null);
  const [busy, setBusy] = useState(null); // 'share' | 'save' | null

  const middleCard = reading?.cards?.[1] || reading?.cards?.[0];
  const slug = cardSlug(middleCard?.name);
  const mainCardSrc = `/images/tarot/${slug}.webp`;
  const topic = stripEmoji(topicTitle);
  let predictionText = (middleCard?.text || reading?.message || '').trim();
  if (predictionText.length > 115) predictionText = predictionText.substring(0, 112) + '...';

  async function generateImage() {
    const { default: html2canvas } = await import('html2canvas');
    const node = shareRef.current;
    if (!node) throw new Error('share-card node missing');

    // wait for images inside #share-card
    const imgs = node.querySelectorAll('img');
    await Promise.all(
      Array.from(imgs).map(img =>
        new Promise(resolve => {
          if (img.complete && img.naturalWidth > 0) return resolve();
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        })
      )
    );

    // wait for Prompt font ready so Thai descenders render correctly
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch {}
    }

    const canvas = await html2canvas(node, {
      scale: 1,
      useCORS: true,
      backgroundColor: null,
      width: 1080,
      height: 1920,
      logging: false,
    });
    return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function shareReading() {
    if (busy) return;
    setBusy('share');
    try {
      const blob = await generateImage();
      if (!blob) throw new Error('blob is null');
      const fileName = `pickmystic-${slug}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'คำทำนายของฉันจาก Pick Mystic',
            text: 'ดูคำทำนายไพ่ทาโรต์ของฉันที่ pickmystic.com',
          });
        } catch (e) {
          if (e.name !== 'AbortError') throw e;
        }
      } else {
        downloadBlob(blob, fileName);
      }
    } catch (err) {
      console.error('share failed:', err);
      alert('เกิดข้อผิดพลาดในการสร้างภาพ ลองใหม่อีกครั้ง');
    } finally {
      setBusy(null);
    }
  }

  async function saveImage() {
    if (busy) return;
    setBusy('save');
    try {
      const blob = await generateImage();
      if (!blob) throw new Error('blob is null');
      downloadBlob(blob, `pickmystic-${slug}.png`);
    } catch (err) {
      console.error('save failed:', err);
      alert('เกิดข้อผิดพลาดในการสร้างภาพ ลองใหม่อีกครั้ง');
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="action-row">
        <button
          type="button"
          className="action-btn action-btn--primary"
          onClick={shareReading}
          disabled={busy !== null}
        >
          <span>✨</span> {busy === 'share' ? 'กำลังสร้างภาพ...' : 'แชร์ผลทำนาย'}
        </button>
        <button
          type="button"
          className="action-btn"
          onClick={saveImage}
          disabled={busy !== null}
        >
          <span>💾</span> {busy === 'save' ? 'กำลังบันทึก...' : 'บันทึกรูป'}
        </button>
        <button type="button" className="action-btn" onClick={onReset}>
          <span>↺</span> เปิดไพ่ใหม่
        </button>
        <Link href="/" className="action-btn">← กลับหน้าแรก</Link>
      </div>

      {/* Hidden 1080x1920 share card rendered to canvas only */}
      <div id="share-card" ref={shareRef} aria-hidden="true">
        <img src="/images/share/share-bg.webp" className="share-bg" alt="" crossOrigin="anonymous" />
        {slug && (
          <img
            id="share-main-card"
            src={mainCardSrc}
            className="share-main-card"
            alt=""
            crossOrigin="anonymous"
          />
        )}
        <div className="share-topic"><p>{topic ? `✦ ${topic} ✦` : ''}</p></div>
        <div className="share-prediction"><p>{predictionText}</p></div>
        <img src="/images/share/mascot.webp" className="share-mascot" alt="" crossOrigin="anonymous" />
      </div>
    </>
  );
}
