import Link from 'next/link';

export const metadata = {
  title: 'ดูดวงจากคำถาม เปิดไพ่ทาโรต์ 3 ใบ ฟรี',
  description: 'พิมพ์คำถามแล้วเปิดไพ่ทาโรต์ 3 ใบ ระบบจะตีความให้ตรงกับคำถามของคุณ',
};

export default function QuickReadingPage() {
  return (
    <main className="container">
      <section className="reading-page" id="ask-section">
        <Link href="/" className="back-link">← กลับหน้าแรก</Link>

        <h1 className="section-title">พิมพ์คำถาม แล้วเปิดไพ่ 3 ใบ</h1>
        <p className="section-subtitle">ตั้งคำถามที่อยู่ในใจคุณ แล้วให้ไพ่ทาโรต์ทั้ง 3 ใบช่วยกระซิบคำตอบ</p>

        <div className="content-page" style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ color: '#6B5B7A' }}>
            🛠 ฟีเจอร์ Quick Reading กำลัง migrate มาเวอร์ชัน Next.js
            <br />
            (Phase 1 — wiring engine + UI ครั้งต่อไป)
          </p>
          <p style={{ marginTop: 24 }}>
            ระหว่างนี้ลองเปิดไพ่จากหัวข้อสำเร็จรูปได้เลย:
          </p>
          <Link href="/readings" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
            ดูคำทำนายทั้งหมด →
          </Link>
        </div>
      </section>
    </main>
  );
}
