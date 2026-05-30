'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

import ReadingShareButtons from '@/components/ReadingShareButtons';
import { urlFor } from '@/sanity/image';

export default function ReadingClient({ topic, results }) {
  const [stage, setStage] = useState('pick'); // pick | selected | transitioning | reading
  const [selectedPile, setSelectedPile] = useState(null);
  const [result, setResult] = useState(null);
  const captureRef = useRef(null);

  function pickPile(pileId) {
    if (stage !== 'pick') return;
    setSelectedPile(pileId);
    setStage('selected');
    setTimeout(() => {
      setStage('transitioning');
      setTimeout(() => {
        setResult(results[pileId - 1]);
        setStage('reading');
        setTimeout(() => {
          document
            .getElementById('reading-section')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }, 450);
    }, 700);
  }

  function reset() {
    setResult(null);
    setSelectedPile(null);
    setStage('pick');
    setTimeout(() => {
      document
        .getElementById('pick-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }

  if (stage === 'reading' && result) {
    return (
      <section className="reading-section" id="reading-section">
        <div id="reading-content">
          <div ref={captureRef}>
            <header className="reveal-head">
              <div className="reveal-eyebrow">✦ คำทำนายสำหรับคุณ ✦</div>
              <h2 className="reveal-title">{result.resultTitle}</h2>
              <p className="reveal-sub">
                {result.subtitle ||
                  'ไพ่ทั้ง 3 ใบนี้คือคำแนะนำและคำตอบที่คุณกำลังมองหา'}
              </p>
            </header>

            <div className="reveal-cards">
              {result.cards.map((c, i) => (
                <ReadingCard key={i} card={c} index={i} />
              ))}
            </div>

            <section className="reveal-summary">
              <div className="reveal-summary-icon">🌙</div>
              <div className="reveal-summary-body">
                <h3 className="reveal-summary-title">สรุปคำทำนาย</h3>
                <p>{result.summary}</p>
              </div>
            </section>

            {result.advice && (
              <section className="reveal-summary">
                <div className="reveal-summary-icon">🕯️</div>
                <div className="reveal-summary-body">
                  <h3 className="reveal-summary-title">คำแนะนำจากจักรวาล</h3>
                  <p>{result.advice}</p>
                </div>
              </section>
            )}

            <p className="reveal-disclaimer">
              * คำทำนายนี้เป็นแนวทางเพื่อการพิจารณา ไม่สามารถยืนยันผลลัพธ์ได้แน่นอน
            </p>
          </div>

          <div className="reveal-share-card">
            <ReadingShareButtons
              title={topic.title}
              slug={topic.slug}
              captureRef={captureRef}
            />
          </div>

          <div className="reveal-actions">
            <button type="button" className="btn-primary" onClick={reset}>
              เปิดไพ่ใหม่
            </button>
            <Link href="/readings" className="btn-secondary">
              กลับหน้าเลือกหัวข้อ
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {stage === 'transitioning' && (
        <div className="reveal-overlay visible">
          <img
            className="reveal-overlay-mascot"
            src="/images/fortune-rabbit-loading-mascot.webp"
            alt=""
            aria-hidden="true"
          />
          <div className="reveal-overlay-text">กำลังเปิดคำทำนาย...</div>
        </div>
      )}

      <section className="reading-page" id="pick-section">
        <Link href="/readings" className="back-link">
          ← กลับหน้าเลือกหัวข้อ
        </Link>

        <h1 className="section-title">{topic.title}</h1>
        <p className="section-subtitle">
          {topic.shortDescription || 'ตั้งใจนึก แล้วเลือกไพ่ที่ดึงดูดคุณ'}
        </p>

        <div className={`cards-grid${selectedPile ? ' locked' : ''}`}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`pile${selectedPile === n ? ' selected' : ''}${
                selectedPile && selectedPile !== n ? ' dimmed' : ''
              }`}
              onClick={() => pickPile(n)}
            >
              <img
                src="/images/card-back.webp"
                alt={`ไพ่ที่ ${n}`}
                loading="lazy"
              />
              <div className="pile-num">{n}</div>
              <div className="pile-badge">✨ ไพ่ของคุณ</div>
            </div>
          ))}
        </div>

        <div className="hint">
          💡 ไม่ต้องคิดนานเกินไป เลือกจากความรู้สึกแรกที่ดึงดูดคุณ
        </div>

        <section className="mascot-section">
          <img
            src="/images/mascot-pick.webp"
            alt="Pick Mystic mascot"
            className="mascot-img"
          />
          <p className="mascot-message">ขอบคุณที่ใช้ Pick Mystic ✨</p>
        </section>
      </section>
    </>
  );
}

function ReadingCard({ card, index }) {
  const tarot = card.card || {};
  const imgUrl = tarot.image
    ? urlFor(tarot.image).width(400).format('webp').url()
    : null;

  return (
    <article
      className="reveal-card"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="rc-media">
        <span className="rc-num">{index + 1}</span>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={tarot.name || ''}
            width={400}
            height={680}
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized
            crossOrigin="anonymous"
          />
        ) : (
          <div className="rc-placeholder">
            <span>{tarot.name}</span>
          </div>
        )}
      </div>
      <div className="rc-info">
        <div className="rc-heading">
          <span className="rc-phase">{card.position}</span>
          <h3 className="rc-name">{tarot.name}</h3>
          {tarot.nameTh && <span className="rc-thai">{tarot.nameTh}</span>}
        </div>
        {Array.isArray(card.tags) && card.tags.length > 0 && (
          <ul className="rc-keywords">
            {card.tags.map((kw, i) => (
              <li key={i}>{kw}</li>
            ))}
          </ul>
        )}
      </div>
      {Array.isArray(card.meaning) && card.meaning.length > 0 && (
        <div className="rc-text">
          <PortableText value={card.meaning} />
        </div>
      )}
    </article>
  );
}
