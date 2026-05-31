import Link from 'next/link';

export const metadata = {
  title: 'ไพ่ใบนี้หายไปในมิติอื่น',
  description: 'ไม่พบหน้านี้ — กลับไปเลือกไพ่ใหม่ที่หน้าแรกหรือคลังคำทำนาย',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="container">
      <section
        className="content-page"
        style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 96 }}
      >
        <img
          src="/images/mascot-pick.webp"
          alt="กระต่ายพ่อมด Pick Mystic"
          width="180"
          height="180"
          style={{ display: 'block', margin: '0 auto 24px', opacity: 0.95 }}
        />
        <p
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: '#7E57C2',
            lineHeight: 1,
            margin: 0,
            letterSpacing: '0.04em',
          }}
        >
          404
        </p>
        <h1 style={{ color: '#3D2A5C', marginTop: 12 }}>
          ไพ่ใบนี้หายไปในมิติอื่น
        </h1>
        <p
          className="subtitle"
          style={{ marginBottom: 32 }}
        >
          ✦ จักรวาลยังไม่เปิดเผยหน้านี้ให้คุณตอนนี้ ✦
        </p>
        <p style={{ color: '#6B5A8C', marginBottom: 40, lineHeight: 1.8 }}>
          หน้าที่คุณตามหาอาจถูกย้ายไป หรือไม่เคยมีอยู่จริงในสำรับนี้
          ลองกลับไปเลือกไพ่ใหม่ดูสิ — บางทีคำตอบอาจรออยู่ที่อื่น
        </p>
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" className="btn btn-primary btn-lg">
            ✨ กลับหน้าแรก
          </Link>
          <Link href="/readings" className="btn btn-secondary btn-lg">
            🔮 ดูคำทำนายทั้งหมด
          </Link>
        </div>
      </section>
    </main>
  );
}
