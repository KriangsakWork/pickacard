'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'user_birthday_day';

const PALETTE = {
  rose:       { name: 'ชมพูกุหลาบ',     from: '#FFD1E3', to: '#FF9EC4', glow: '#FFB6D2' },
  peach:      { name: 'พีชอบอุ่น',       from: '#FFE0C2', to: '#FFB98A', glow: '#FFCBA0' },
  gold:       { name: 'ทองมงคล',        from: '#FFE7A6', to: '#FFD76A', glow: '#FFDF8C' },
  cream:      { name: 'ครีมนวล',         from: '#FFF3CF', to: '#FFE3A0', glow: '#FFEBBC' },
  mint:       { name: 'เขียวมิ้นต์',     from: '#C8F2DD', to: '#8FE0BC', glow: '#A9E9CC' },
  sage:       { name: 'เขียวเสจ',        from: '#DCEBC8', to: '#B5D98F', glow: '#C8E2AB' },
  sky:        { name: 'ฟ้าใส',           from: '#CBE6FF', to: '#97C7FB', glow: '#B1D6FD' },
  aqua:       { name: 'ฟ้าอความารีน',    from: '#C6F0EE', to: '#8FE0DC', glow: '#AAE8E5' },
  lavender:   { name: 'ม่วงลาเวนเดอร์',  from: '#DED3FF', to: '#B9A5FF', glow: '#CBBCFF' },
  violet:     { name: 'ม่วงมงคล',        from: '#C9B3FF', to: '#8E6BFF', glow: '#B49BFF' },
  periwinkle: { name: 'ม่วงพีริวิงเคิล', from: '#D2D8FF', to: '#A5B0FF', glow: '#BBC4FF' },
  coral:      { name: 'ปะการังอ่อน',     from: '#FFCEC4', to: '#FF9E8F', glow: '#FFB6A9' },
  smoke:      { name: 'เทาควันหมอก',     from: '#D6D1E0', to: '#A89FBF', glow: '#C2BAD2' },
  navy:       { name: 'น้ำเงินสนธยา',    from: '#B9C3E6', to: '#8190C4', glow: '#A3AFD6' },
};

const BIRTHDAYS = {
  sunday:    { label: 'คนเกิดวันอาทิตย์',   pillBg: '#FF9999', work: 'mint',     money: 'violet', love: 'rose',   mercy: 'cream',    luck: 'gold',  avoid: 'sky' },
  monday:    { label: 'คนเกิดวันจันทร์',     pillBg: '#FFEB99', work: 'peach',    money: 'coral',  love: 'sage',   mercy: 'cream',    luck: 'gold',  avoid: 'navy' },
  tuesday:   { label: 'คนเกิดวันอังคาร',     pillBg: '#FFB3D9', work: 'smoke',    money: 'gold',   love: 'violet', mercy: 'sky',      luck: 'peach', avoid: 'cream' },
  wednesday: { label: 'คนเกิดวันพุธ',        pillBg: '#A8E6A3', work: 'peach',    money: 'sage',   love: 'cream',  mercy: 'coral',    luck: 'navy',  avoid: 'rose' },
  thursday:  { label: 'คนเกิดวันพฤหัสบดี',   pillBg: '#FFCC99', work: 'coral',    money: 'peach',  love: 'smoke',  mercy: 'lavender', luck: 'mint',  avoid: 'gold' },
  friday:    { label: 'คนเกิดวันศุกร์',      pillBg: '#A3D5FF', work: 'lavender', money: 'gold',   love: 'sky',    mercy: 'cream',    luck: 'rose',  avoid: 'navy' },
  saturday:  { label: 'คนเกิดวันเสาร์',      pillBg: '#C9A3FF', work: 'sky',      money: 'cream',  love: 'smoke',  mercy: 'gold',     luck: 'mint',  avoid: 'violet' },
};

const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const DAY_SHORT = { monday: 'จ.', tuesday: 'อ.', wednesday: 'พ.', thursday: 'พฤ.', friday: 'ศ.', saturday: 'ส.', sunday: 'อา.' };
const DAY_FULL  = { monday: 'จันทร์', tuesday: 'อังคาร', wednesday: 'พุธ', thursday: 'พฤหัสบดี', friday: 'ศุกร์', saturday: 'เสาร์', sunday: 'อาทิตย์' };

const CATEGORIES = [
  { key: 'work',  label: 'การงาน'         },
  { key: 'money', label: 'การเงิน'        },
  { key: 'love',  label: 'ความรัก'        },
  { key: 'mercy', label: 'เมตตา'          },
  { key: 'luck',  label: 'โชคลาภ'         },
  { key: 'avoid', label: 'สีที่ควรเลี่ยง' },
];

export default function LuckyColors() {
  const [day, setDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDay, setPendingDay] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && BIRTHDAYS[stored]) setDay(stored);
    } catch {}
    setHydrated(true);
  }, []);

  function openModal() {
    setPendingDay(day);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    setModalOpen(false);
    document.body.style.overflow = '';
  }

  function confirmDay() {
    if (!pendingDay) return;
    try { localStorage.setItem(STORAGE_KEY, pendingDay); } catch {}
    setDay(pendingDay);
    closeModal();
  }

  useEffect(() => {
    if (!modalOpen) return;
    function onKey(e) { if (e.key === 'Escape') closeModal(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const info = day ? BIRTHDAYS[day] : null;

  return (
    <>
      <div className="lucky-widget" id="luckyWidget">
        {hydrated && !day && (
          <div className="lucky-placeholder">
            <div className="lucky-placeholder-visual">
              <img src="/images/bunny-wardrobe.webp" alt="กระต่ายกับเสื้อคลุมหลากสี" loading="lazy" />
            </div>
            <div className="lucky-placeholder-body">
              <h3 className="lucky-placeholder-title">บอกเราหน่อยว่าคุณเกิดวันอะไร</h3>
              <p className="lucky-placeholder-text">เพื่อดูสีถูกโฉลกที่เสริมพลังให้คุณ</p>
              <button type="button" className="btn btn-primary" onClick={openModal}>
                เลือกวันเกิดของคุณ →
              </button>
            </div>
          </div>
        )}

        {hydrated && day && info && (
          <div className="lucky-result">
            <div className="lucky-widget-head">
              <span className="lucky-day-pill"><strong>{info.label}</strong></span>
              <div className="lucky-head-right">
                <button type="button" className="lucky-change-btn" onClick={openModal}>เปลี่ยนวันเกิด</button>
                <img className="lucky-head-bunny" src="/images/bunny-wardrobe.webp" alt="" aria-hidden="true" loading="lazy" />
              </div>
            </div>

            <div className="lucky-grid">
              {CATEGORIES.map(cat => {
                const color = PALETTE[info[cat.key]];
                const isAvoid = cat.key === 'avoid';
                return (
                  <div key={cat.key} className={`lucky-card${isAvoid ? ' is-avoid' : ''}`}>
                    <span
                      className="lucky-swatch"
                      style={{ '--from': color.from, '--to': color.to, '--glow': color.glow }}
                    />
                    <span className="lucky-cat">{cat.label}</span>
                    <span className="lucky-color-name">{color.name}</span>
                  </div>
                );
              })}
            </div>

            <div className="lucky-cta">
              <p className="lucky-cta-text">อยากรู้ดวงของคุณวันนี้ไหม?</p>
              <Link className="btn btn-primary" href="#topics">เปิดไพ่ของวันนี้</Link>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="birthday-modal" role="dialog" aria-modal="true" aria-labelledby="birthdayModalTitle">
          <div className="birthday-modal-backdrop" onClick={closeModal} />
          <div className="birthday-modal-card" role="document">
            <h3 className="birthday-modal-title" id="birthdayModalTitle">คุณเกิดวันอะไร?</h3>
            <p className="birthday-modal-sub">เลือกวันเกิดของคุณเพื่อดูสีถูกโฉลกตามหลักโหราศาสตร์ไทย</p>
            <div className="birthday-days">
              {DAY_ORDER.map(d => (
                <button
                  key={d}
                  type="button"
                  data-day={d}
                  className={`birthday-day${pendingDay === d ? ' is-selected' : ''}`}
                  onClick={() => setPendingDay(d)}
                >
                  <span className="birthday-day-short">{DAY_SHORT[d]}</span>
                  <span className="birthday-day-full">{DAY_FULL[d]}</span>
                </button>
              ))}
            </div>
            <div className="birthday-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>ปิด</button>
              <button type="button" className="btn btn-primary" onClick={confirmDay} disabled={!pendingDay}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
