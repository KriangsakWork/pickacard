'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { detect } from '@/lib/category-detector';
import { generate } from '@/lib/spread-generator';
import { getV2Meaning, getCardMeta, ALL_V2_CARD_NAMES } from '@/lib/tarot-meaning';

const ShareButtons = dynamic(() => import('./ShareButtons'), { ssr: false });

const CATEGORY_META = {
  love: {
    label: 'ความรัก', emoji: '💜', headline: 'คำตอบเรื่องหัวใจที่คุณตามหา',
    summary: 'เรื่องของหัวใจไม่เคยมีสูตรสำเร็จ ทุกความรู้สึกที่เกิดขึ้นล้วนมีความหมาย ลองฟังเสียงข้างในอย่างอ่อนโยนแล้วให้เวลาเป็นเครื่องเปิดเผยคำตอบ',
    advice: 'รักตัวเองให้พอ ก่อนรอใครให้เต็มหัวใจของคุณ',
  },
  reconciliation: {
    label: 'การคืนดี', emoji: '🕊️', headline: 'สัญญาณจากใจอีกฝ่าย',
    summary: 'การคืนดีต้องการเวลาและจังหวะที่เหมาะสม สิ่งที่คุณทำได้ในตอนนี้คือดูแลใจตัวเองให้พร้อม ไม่ว่าคำตอบจะเป็นอย่างไร',
    advice: 'อย่ารีบเร่งความสัมพันธ์ — ให้ใจทั้งสองได้มีพื้นที่หายใจ',
  },
  crush: {
    label: 'คนที่แอบชอบ', emoji: '💫', headline: 'ใจของอีกฝ่ายกำลังบอกอะไร',
    summary: 'ความรู้สึกแรกเริ่มมักเปราะบาง ค่อย ๆ ทำความรู้จักกันให้ลึกขึ้น ก่อนปั้นภาพในใจล่วงหน้า',
    advice: 'เปิดบทสนทนาเล็ก ๆ ด้วยความจริงใจ มันเดินทางได้ไกลกว่าที่คิด',
  },
  healing: {
    label: 'การเยียวยาใจ', emoji: '🌿', headline: 'แสงที่นำคุณกลับคืนสู่ตัวเอง',
    summary: 'ทุกบาดแผลต้องการเวลาและพื้นที่ในการรักษา อนุญาตให้ตัวเองได้รู้สึกโดยไม่ต้องตัดสิน',
    advice: 'ดูแลใจตัวเองวันนี้ เหมือนที่คุณเคยดูแลคนที่คุณรัก',
  },
  luck: {
    label: 'โชคลาภ', emoji: '🍀', headline: 'จังหวะโชคที่กำลังไหลมาหาคุณ',
    summary: 'โชคไม่ได้มาแบบหวือหวาเสมอ บางครั้งซ่อนอยู่ในรายละเอียดเล็ก ๆ ที่คุณเลือกจะใส่ใจ',
    advice: 'เปิดใจรับโอกาสที่ไม่อยู่ในแผน — บางครั้งมันคือคำตอบที่ใช่',
  },
  money: {
    label: 'การเงิน', emoji: '💰', headline: 'พลังงานทางการเงินของคุณตอนนี้',
    summary: 'เรื่องเงินสะท้อนทั้งการตัดสินใจและความเชื่อในตัวเอง วางแผนอย่างใจเย็นและตรวจสอบรายละเอียดให้ครบ',
    advice: 'อย่าให้ความกลัวตัดสินแทนคุณ — ลงมือทีละก้าวอย่างมีสติ',
  },
  career: {
    label: 'การงาน', emoji: '💼', headline: 'ทิศทางการงานที่จักรวาลกระซิบให้คุณฟัง',
    summary: 'งานที่ใช่คืองานที่ทำให้คุณยังเป็นตัวเอง ฟังเสียงข้างในให้บ่อยพอ ๆ กับฟังความเห็นคนอื่น',
    advice: 'ลงมือกับสิ่งที่ทำได้วันนี้ — เส้นทางจะค่อย ๆ ปรากฏเอง',
  },
  future: {
    label: 'อนาคต', emoji: '🌙', headline: 'ภาพข้างหน้าที่ไพ่อยากบอกคุณ',
    summary: 'อนาคตไม่ใช่สิ่งที่ถูกขีดไว้ตายตัว แต่คือผลของก้าวที่คุณเลือกในวันนี้ ค่อย ๆ เดินไปด้วยความเชื่อมั่นในตัวเอง',
    advice: 'ให้เวลาทำงานของมัน — สิ่งที่ใช่จะมาในจังหวะที่ใช่',
  },
};

const EXAMPLES = [
  'เขาจะกลับมามั้ย',
  'เขาคิดยังไงกับเรา',
  'งานใหม่จะได้ไหม',
  'อนาคตจะเป็นยังไง',
];

function buildReading(question) {
  const detected = detect(question);
  const categoryId = detected.category || 'future';
  const meta = CATEGORY_META[categoryId] || CATEGORY_META.future;

  const spread = generate('quick3', ALL_V2_CARD_NAMES);

  const cards = spread.cards.map((slot, idx) => {
    const entry = getV2Meaning(slot.card, categoryId, 'upright');
    return {
      position: { num: idx + 1, label: slot.label, id: slot.position },
      card: getCardMeta(slot.card),
      orientation: 'upright',
      keywords: entry.keywords,
      meaning: entry.interpretation,
    };
  });

  const names = cards.map(b => b.card.nameTh || b.card.name);
  const lead = names.length === 3
    ? `ไพ่ทั้งสามใบของคุณ — ${names[0]}, ${names[1]} และ ${names[2]} — มาบรรจบกันเพื่อสะท้อนภาพช่วงเวลานี้ให้คุณเห็นชัดขึ้น`
    : 'ไพ่ที่คุณเปิดได้กำลังสะท้อนภาพช่วงเวลานี้ให้คุณเห็นชัดขึ้น';

  return {
    question: question.trim(),
    category: { id: categoryId, label: meta.label, emoji: meta.emoji },
    headline: meta.headline,
    cards,
    summary: `${lead} ${meta.summary || ''}`.trim(),
    advice: meta.advice || '',
    detected,
  };
}

export default function QuickReadingExperience() {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [stage, setStage] = useState('ask'); // 'ask' | 'transitioning' | 'reading'
  const [reading, setReading] = useState(null);

  function setQ(v) {
    setQuestion(v);
    if (error) setError('');
  }

  function onSubmit(e) {
    e.preventDefault();
    const q = question.trim();
    if (q.length < 2) {
      setError('พิมพ์คำถามที่อยู่ในใจคุณก่อนนะ แล้วค่อยเปิดไพ่');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (stage !== 'ask') return;
    setStage('transitioning');

    setTimeout(() => {
      try {
        const result = buildReading(q);
        setReading(result);
        setStage('reading');
        setTimeout(() => {
          const el = document.getElementById('quick-reading-result');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (err) {
        console.error('quick reading failed:', err);
        setError('ขออภัย เปิดคำทำนายไม่สำเร็จ ลองใหม่อีกครั้งนะ');
        setStage('ask');
      }
    }, 650);
  }

  function reset() {
    setReading(null);
    setStage('ask');
    setQuestion('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (stage === 'reading' && reading) {
    // adapt to ShareButtons (which expects cards[].name + .text)
    const middleBlock = reading.cards[1] || reading.cards[0];
    const shareReading = {
      cards: reading.cards.map(b => ({ name: b.card.name, text: b.meaning })),
      message: reading.summary,
    };

    return (
      <section className="reading-section" id="quick-reading-result">
        <header className="reveal-head">
          <div className="reveal-eyebrow">✦ คำทำนายจากคำถามของคุณ ✦</div>
          <h2 className="reveal-title">{reading.headline}</h2>
          <div className="quick-result-meta">
            <span className="quick-qbubble">“{reading.question}”</span>
            <span className="quick-cat-pill">
              {reading.category.emoji} {reading.category.label}
            </span>
          </div>
        </header>

        <div className="reveal-cards">
          {reading.cards.map((block, i) => (
            <article
              key={i}
              className="reveal-card"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="rc-media">
                <span className="rc-num">{i + 1}</span>
                <img
                  src={block.card.image || '/images/card-back.webp'}
                  alt={`ไพ่${block.card.nameTh || block.card.name}`}
                  loading="lazy"
                />
              </div>
              <div className="rc-info">
                <div className="rc-heading">
                  <span className="rc-phase">
                    ใบที่ {block.position.num} · {block.position.label}
                  </span>
                  <h3 className="rc-name">{block.card.name}</h3>
                  {block.card.nameTh && (
                    <span className="rc-thai">{block.card.nameTh}</span>
                  )}
                </div>
                <ul className="rc-keywords">
                  {block.keywords.map((kw, j) => <li key={j}>{kw}</li>)}
                </ul>
              </div>
              <p className="rc-text">{block.meaning}</p>
            </article>
          ))}
        </div>

        <section
          className="reveal-summary"
          style={{ animationDelay: `${reading.cards.length * 0.12 + 0.05}s` }}
        >
          <div className="reveal-summary-icon">🌙</div>
          <div className="reveal-summary-body">
            <h3 className="reveal-summary-title">สรุปคำทำนาย</h3>
            <p>{reading.summary}</p>
          </div>
        </section>

        {reading.advice && (
          <section
            className="reveal-summary"
            style={{ animationDelay: `${reading.cards.length * 0.12 + 0.1}s` }}
          >
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
          topicTitle={reading.headline}
          reading={shareReading}
          onReset={reset}
        />
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
          <div className="reveal-overlay-text">กำลังเปิดไพ่ของคุณ...</div>
        </div>
      )}

      <section className="reading-page" id="ask-section">
        <Link href="/" className="back-link">← กลับหน้าแรก</Link>

        <h1 className="section-title">พิมพ์คำถาม แล้วเปิดไพ่ 3 ใบ</h1>
        <p className="section-subtitle">
          ตั้งคำถามที่อยู่ในใจคุณ แล้วให้ไพ่ทาโรต์ทั้ง 3 ใบช่วยกระซิบคำตอบ
        </p>

        <form className="quick-ask" onSubmit={onSubmit} noValidate>
          <div className="quick-deck" aria-hidden="true">
            <img src="/images/card-back.webp" alt="" loading="lazy" />
            <img src="/images/card-back.webp" alt="" loading="lazy" />
            <img src="/images/card-back.webp" alt="" loading="lazy" />
          </div>

          <label className="quick-field-label" htmlFor="questionInput">คำถามของคุณ</label>
          <input
            id="questionInput"
            type="text"
            className={`quick-input${shake ? ' quick-input-shake' : ''}`}
            placeholder="พิมพ์คำถามที่คุณอยากรู้..."
            autoComplete="off"
            maxLength={120}
            value={question}
            onChange={e => setQ(e.target.value)}
            aria-describedby="askError"
          />

          {error && <p className="quick-error" role="alert">{error}</p>}

          <div className="quick-examples">
            <span className="quick-examples-label">ลองถามแบบนี้</span>
            <div className="quick-chips">
              {EXAMPLES.map(q => (
                <button
                  key={q}
                  type="button"
                  className="quick-chip"
                  onClick={() => { setQ(q); }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={stage === 'transitioning'}
          >
            ✨ เปิดไพ่ 3 ใบ
          </button>
        </form>

        <div className="hint">💡 ตั้งใจกับคำถามสักครู่ แล้วปล่อยให้ความรู้สึกแรกนำทางคุณ</div>

        <section className="quick-steps">
          <h2 className="quick-steps-title">ดูดวงจากคำถามทำงานอย่างไร</h2>
          <div className="quick-steps-grid">
            <article className="quick-step">
              <span className="quick-step-num">1</span>
              <h3>พิมพ์คำถาม</h3>
              <p>เขียนสิ่งที่อยากรู้ ไม่ว่าจะเป็นเรื่องความรัก การงาน การเงิน หรืออนาคต</p>
            </article>
            <article className="quick-step">
              <span className="quick-step-num">2</span>
              <h3>ระบบเปิดไพ่ให้</h3>
              <p>ไพ่ทาโรต์ 3 ใบจะถูกสุ่มขึ้นมา แทนสถานการณ์ปัจจุบัน สิ่งที่ซ่อนอยู่ และแนวโน้มข้างหน้า</p>
            </article>
            <article className="quick-step">
              <span className="quick-step-num">3</span>
              <h3>อ่านคำทำนาย</h3>
              <p>รับคำทำนายที่เรียบเรียงให้ตรงกับหมวดหมู่คำถามของคุณโดยเฉพาะ</p>
            </article>
          </div>
        </section>

        <section className="mascot-section">
          <img src="/images/mascot-pick.webp" alt="Pick Mystic mascot" className="mascot-img" />
          <p className="mascot-message">ทุกคำถาม มีคำตอบรออยู่เสมอ ✨</p>
        </section>
      </section>
    </>
  );
}
