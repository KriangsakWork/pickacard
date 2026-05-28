'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ShareButtons = dynamic(() => import('./ShareButtons'), { ssr: false });

function cardSlug(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '-');
}

export default function ReadingExperience({ topic, readings }) {
  const [stage, setStage] = useState('pick'); // 'pick' | 'transitioning' | 'reading'
  const [selectedPile, setSelectedPile] = useState(null);
  const [reading, setReading] = useState(null);

  function pickPile(pileId) {
    if (stage !== 'pick') return;
    setSelectedPile(pileId);
    setStage('transitioning');
    setTimeout(() => {
      setReading(readings[pileId]);
      setStage('reading');
      setTimeout(() => {
        const el = document.getElementById('reading-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }, 1150);
  }

  function resetReading() {
    setReading(null);
    setSelectedPile(null);
    setStage('pick');
    setTimeout(() => {
      const el = document.getElementById('pick-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }

  if (stage === 'reading' && reading) {
    return (
      <section className="reading-section" id="reading-section">
        <div id="reading-content">
          <header className="reveal-head">
            <div className="reveal-eyebrow">✦ คำทำนายสำหรับคุณ ✦</div>
            <h2 className="reveal-title">{reading.intro}</h2>
            <p className="reveal-sub">
              {reading.sub || 'ไพ่ทั้ง 3 ใบนี้คือคำแนะนำและคำตอบที่คุณกำลังมองหา'}
            </p>
          </header>

          <div className="reveal-cards">
            {reading.cards.map((card, i) => (
              <ReadingCard key={i} card={card} index={i} />
            ))}
          </div>

          <section className="reveal-summary">
            <div className="reveal-summary-icon">🌙</div>
            <div className="reveal-summary-body">
              <h3 className="reveal-summary-title">สรุปคำทำนาย</h3>
              <p>{reading.message}</p>
            </div>
          </section>

          {reading.advice && (
            <section className="reveal-summary">
              <div className="reveal-summary-icon">🕯️</div>
              <div className="reveal-summary-body">
                <h3 className="reveal-summary-title">คำแนะนำจากจักรวาล</h3>
                <p>{reading.advice}</p>
              </div>
            </section>
          )}

          <p className="reveal-disclaimer">
            * คำทำนายนี้เป็นแนวทางเพื่อการพิจารณา ไม่สามารถยืนยันผลลัพธ์ได้แน่นอน
          </p>

          <ShareButtons
            topicTitle={topic.title}
            reading={reading}
            onReset={resetReading}
          />
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
        <Link href="/readings" className="back-link">← กลับหน้าเลือกหัวข้อ</Link>

        <h1 className="section-title">{topic.title}</h1>
        <p className="section-subtitle">{topic.subtitle || 'ตั้งใจนึก แล้วเลือกไพ่ที่ดึงดูดคุณ'}</p>

        <div className={`cards-grid${selectedPile ? ' locked' : ''}`}>
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className={`pile${selectedPile === n ? ' selected' : ''}${
                selectedPile && selectedPile !== n ? ' dimmed' : ''
              }`}
              onClick={() => pickPile(n)}
            >
              <img src="/images/card-back.webp" alt={`ไพ่ที่ ${n}`} loading="lazy" />
              <div className="pile-num">{n}</div>
              <div className="pile-badge">✨ ไพ่ของคุณ</div>
            </div>
          ))}
        </div>

        <div className="hint">💡 ไม่ต้องคิดนานเกินไป เลือกจากความรู้สึกแรกที่ดึงดูดคุณ</div>

        <section className="mascot-section">
          <img src="/images/mascot-pick.webp" alt="Pick Mystic mascot" className="mascot-img" />
          <p className="mascot-message">ขอบคุณที่ใช้ Pick Mystic ✨</p>
        </section>
      </section>
    </>
  );
}

function ReadingCard({ card, index }) {
  const slug = cardSlug(card.name);
  const keywords = (card.meaning || '').trim().split(/\s+/);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="reveal-card" style={{ animationDelay: `${index * 0.12}s` }}>
      <div className="rc-media">
        <span className="rc-num">{index + 1}</span>
        {imgFailed ? (
          <div className="rc-placeholder"><span>{card.name}</span></div>
        ) : (
          <img
            src={`/images/tarot/${slug}.webp`}
            alt={card.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <div className="rc-info">
        <div className="rc-heading">
          <span className="rc-phase">{card.phase}</span>
          <h3 className="rc-name">{card.name}</h3>
          {card.thai && <span className="rc-thai">{card.thai}</span>}
        </div>
        <ul className="rc-keywords">
          {keywords.map((kw, i) => <li key={i}>{kw}</li>)}
        </ul>
      </div>
      <p className="rc-text">{card.text}</p>
    </article>
  );
}
