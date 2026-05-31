import Link from 'next/link';
import { ALL_CARDS } from '@/lib/cards';

export const metadata = {
  title: 'ความหมายไพ่ทาโรต์ทั้งหมด',
  description: 'รวมความหมายไพ่ทาโรต์ทุกใบ พร้อมคำอธิบายในด้านความรัก การงาน อนาคต และอื่นๆ',
  alternates: { canonical: '/cards' },
};

const major = ALL_CARDS.filter(c => c.arcana === 'major');
const minor = ALL_CARDS.filter(c => c.arcana !== 'major');

function CardTile({ card }) {
  return (
    <Link href={`/cards/${card.slug}`} className="card-tile">
      <img src={card.image} alt={card.name} loading="lazy" />
      <div className="card-tile-body">
        <h3>{card.name}</h3>
        {card.nameTh !== card.name && <p>{card.nameTh}</p>}
      </div>
    </Link>
  );
}

export default function CardsIndexPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">ห้องสมุดไพ่</span>
            <h1 className="section-title">ความหมายไพ่ทาโรต์</h1>
            <p className="section-subtitle">
              คลังความหมายไพ่ทั้งหมด {ALL_CARDS.length} ใบ พร้อมคำอธิบายรายด้าน
              {ALL_CARDS.length < 78 && ` (ขยายไปครบ 78 ใบในเฟสถัดไป)`}
            </p>
          </div>

          {major.length > 0 && (
            <>
              <h2 className="cards-group-title">Major Arcana</h2>
              <div className="cards-grid-library">
                {major.map(c => <CardTile key={c.slug} card={c} />)}
              </div>
            </>
          )}

          {minor.length > 0 && (
            <>
              <h2 className="cards-group-title">Minor Arcana</h2>
              <div className="cards-grid-library">
                {minor.map(c => <CardTile key={c.slug} card={c} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
