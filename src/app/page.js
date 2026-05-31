import Link from 'next/link';
import LuckyColors from '@/components/LuckyColors';
import ArticleCard from '@/components/ArticleCard';
import ViewAllCard from '@/components/ViewAllCard';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import {
  featuredPickTopicsQuery,
  latestArticlesQuery,
} from '@/sanity/queries';

export const revalidate = 60; // ISR — keep the latest-articles block fresh

export const metadata = {
  title: 'Pick Mystic - ดูดวงไพ่ทาโรต์ออนไลน์ฟรี เปิดไพ่ทำนายอนาคต',
  description:
    'ดูดวงไพ่ทาโรต์ออนไลน์ฟรี เปิดไพ่ทำนายความรัก การงาน การเงิน แม่นยำ พร้อมคำทำนายละเอียดจากกระต่ายพ่อมด Pick Mystic',
  openGraph: {
    type: 'website',
    url: 'https://pickmystic.com/',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
  },
};

export default async function HomePage() {
  // Featured pick topics + latest 3 articles from Sanity. Fall back to empty
  // lists if Sanity is unreachable at build time.
  let featured = [];
  let latestArticles = [];
  try {
    [featured, latestArticles] = await Promise.all([
      client.fetch(featuredPickTopicsQuery),
      client.fetch(latestArticlesQuery, {}, { next: { revalidate: 60 } }),
    ]);
  } catch {
    featured = [];
    latestArticles = [];
  }

  return (
    <>
      {/* HERO */}
      <header className="hero">
        <div className="hero-bg" aria-hidden="true">
          <video className="hero-video" autoPlay loop muted playsInline poster="/images/hero-bg.webp">
            <source src="/images/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-badge">✨ จักรวาลมีคำตอบรอคุณอยู่</span>
            <h1 className="hero-title">
              <span className="hero-title-line">Pick Your</span>
              <span className="hero-title-line hero-title-accent">Destiny</span>
            </h1>
            <p className="hero-desc">เลือกไพ่ที่ดึงดูดใจคุณที่สุด แล้วปล่อยให้จักรวาลกระซิบคำตอบที่ซ่อนอยู่ในใจ</p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href="#topics">✨ เปิดไพ่ของคุณ</a>
              <button className="btn btn-secondary btn-lg" type="button" disabled title="เร็วๆ นี้">
                🌙 ดูดวงประจำวัน
              </button>
            </div>
            <div className="stat-badge">
              <span className="stat-badge-text">ค้นหาคำตอบที่ซ่อนอยู่ในไพ่ใบต่อไปของคุณ</span>
            </div>
          </div>

          <div className="hero-art">
            <img className="hero-mascot" src="/images/mascot-hero.webp" alt="กระต่ายพ่อมดนักพยากรณ์ Pick Mystic" />
          </div>
        </div>
      </header>

      <main>
        {/* QUICK READING PROMO */}
        <section className="section section--promo">
          <div className="container">
            <Link className="quick-promo" href="/quick-reading">
              <span className="quick-promo-glow" aria-hidden="true"></span>
              <div className="quick-promo-body">
                <span className="quick-promo-tag">✦ ฟีเจอร์ใหม่ ✦</span>
                <h2 className="quick-promo-title">มีคำถามในใจ?<br className="mobile-title-br" /> ให้ไพ่ 3 ใบช่วยตอบคุณ</h2>
                <p className="quick-promo-text">
                  พิมพ์คำถามที่คุณอยากรู้ ระบบจะเปิดไพ่ทาโรต์ 3 ใบ พร้อมคำทำนายที่เรียบเรียงให้ตรงกับคำถามของคุณ <span className="quick-promo-free">ฟรี ไม่ต้องสมัคร</span>
                </p>
                <span className="btn btn-primary">พิมพ์คำถามของคุณ →</span>
              </div>
              <span className="quick-promo-cards" aria-hidden="true">
                <img src="/images/card-back.webp" alt="" loading="lazy" />
                <img src="/images/card-back.webp" alt="" loading="lazy" />
                <img src="/images/card-back.webp" alt="" loading="lazy" />
              </span>
            </Link>
          </div>
        </section>

        {/* TOPIC DISCOVERY */}
        <section className="section" id="topics">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">เลือกหัวข้อที่อยากรู้</span>
              <h2 className="section-title">เรื่องไหนที่ใจคุณอยากรู้คำตอบ</h2>
              <p className="section-subtitle">เลือกหัวข้อที่ตรงกับใจคุณตอนนี้ แล้วเริ่มเปิดไพ่ได้ทันที</p>
            </div>

            <div className="topic-grid">
              {featured.map((item) => {
                const imgUrl = item.coverImage
                  ? urlFor(item.coverImage).width(800).format('webp').url()
                  : null;
                return (
                  <Link
                    key={item._id}
                    className="topic-card"
                    href={`/reading/${item.slug}`}
                  >
                    <div className="topic-media">
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.title} loading="lazy" />
                      ) : null}
                      {item.category?.title && (
                        <span className="topic-tag">{item.category.title}</span>
                      )}
                    </div>
                    <div className="topic-body">
                      <h3 className="topic-title">{item.title}</h3>
                      <p className="topic-hook">{item.shortDescription}</p>
                      <span className="topic-cta">เปิดไพ่เลย →</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="section-more">
              <Link href="/readings">ดูคำทำนายทั้งหมด →</Link>
            </div>
          </div>
        </section>

        {/* LUCKY COLORS BY BIRTHDAY */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">เสริมดวงตามวันเกิด</span>
              <h2 className="section-title">สีถูกโฉลกของคุณ</h2>
              <p className="section-subtitle">สีมงคลตามวันเกิด ตามหลักโหราศาสตร์ไทย</p>
            </div>
            <LuckyColors />
          </div>
        </section>

        {/* FEATURED READER BANNER */}
        <section className="section section-tint">
          <div className="container">
            <div className="feature-banner">
              <div className="feature-banner-visual">
                <img src="/images/mascot-topics.webp" alt="หมอดูแนะนำจาก Pick Mystic" loading="lazy" />
              </div>
              <div className="feature-banner-content">
                <span className="feature-banner-tag">หมอดูแนะนำ</span>
                <h2 className="feature-banner-title">ปรึกษาหมอดูตัวจริง แบบเจาะลึก</h2>
                <p className="feature-banner-text">
                  เตรียมพบกับบริการดูดวงส่วนตัวกับหมอดูที่เราคัดสรรมาเพื่อคุณ ทั้งเรื่องความรัก การงาน และเส้นทางชีวิต
                </p>
                <a className="btn btn-primary" href="#topics">ดูรายละเอียด →</a>
              </div>
              <span className="feature-banner-badge">เร็วๆ นี้</span>
            </div>
          </div>
        </section>

        {/* LATEST ARTICLES */}
        <section className="section section-tint">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">เรื่องเล่าจากสำรับไพ่</span>
              <h2 className="section-title">บทความล่าสุด</h2>
              <p className="section-subtitle">ความรู้และเรื่องน่ารู้เกี่ยวกับไพ่ทาโรต์และการดูดวง</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
              {latestArticles.length < 3 && <ViewAllCard />}
            </div>

            <div className="section-more">
              <Link href="/blog">อ่านบทความทั้งหมด →</Link>
            </div>
          </div>
        </section>

        {/* TRUST / BENEFIT */}
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">ทำไมต้องเรา</span>
              <h2 className="section-title">ทำไมต้องเลือก Pick Mystic</h2>
              <p className="section-subtitle">ออกแบบมาให้ใช้ง่าย ปลอดภัย และเป็นมิตรกับใจคุณ</p>
            </div>

            <div className="benefit-grid">
              <article className="benefit-card">
                <div className="benefit-icon"><img src="/images/benefits/easy.webp" alt="" /></div>
                <h3 className="benefit-title">ใช้ง่าย</h3>
                <p className="benefit-text">เลือกไพ่เพียง 1 ใบ รับคำแนะนำจากจักรวาลได้ทันที</p>
              </article>
              <article className="benefit-card">
                <div className="benefit-icon"><img src="/images/benefits/private.webp" alt="" /></div>
                <h3 className="benefit-title">เป็นส่วนตัว</h3>
                <p className="benefit-text">คำทำนายของคุณ เป็นความลับเฉพาะคุณคนเดียว 100%</p>
              </article>
              <article className="benefit-card">
                <div className="benefit-icon"><img src="/images/benefits/inspire.webp" alt="" /></div>
                <h3 className="benefit-title">สร้างแรงบันดาลใจ</h3>
                <p className="benefit-text">มองเห็นทางเลือกใหม่ ๆ และก้าวต่อไปอย่างมั่นใจ</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
