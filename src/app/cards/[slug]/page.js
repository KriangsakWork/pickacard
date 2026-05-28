import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_CARDS, getCardBySlug } from '@/lib/cards';

export function generateStaticParams() {
  return ALL_CARDS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return {};
  return {
    title: `${card.name} (${card.nameTh}) — ความหมายไพ่ทาโรต์`,
    description: `ความหมายของไพ่ ${card.name} ${card.nameTh} ในด้านความรัก การงาน อนาคต และอื่นๆ`,
    openGraph: { images: [card.image] },
  };
}

export default async function CardDetailPage({ params }) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  return (
    <main className="container">
      <section className="card-detail">
        <Link href="/cards" className="back-link">← กลับห้องสมุดไพ่</Link>

        <div className="card-detail-head">
          <div className="card-detail-image">
            <img src={card.image} alt={card.name} />
          </div>
          <div className="card-detail-info">
            <span className="card-detail-arcana">{card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'}</span>
            <h1>{card.name}</h1>
            {card.nameTh !== card.name && <p className="card-detail-name-th">{card.nameTh}</p>}
          </div>
        </div>

        <div className="card-detail-meanings">
          {card.categories.map(cat => (
            <article key={cat.key} className="card-meaning">
              <h2>{cat.label}</h2>
              {cat.upright ? (
                <>
                  {cat.upright.keywords?.length > 0 && (
                    <ul className="card-meaning-keywords">
                      {cat.upright.keywords.map((k, i) => <li key={i}>{k}</li>)}
                    </ul>
                  )}
                  <p>{cat.upright.interpretation}</p>
                </>
              ) : (
                <p className="card-meaning-empty">— ยังไม่มีข้อมูล —</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
