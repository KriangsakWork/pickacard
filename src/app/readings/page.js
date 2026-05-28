import ReadingsBrowser from '@/components/ReadingsBrowser';

export const metadata = {
  title: 'ดูคำทำนายทั้งหมด',
  description: 'รวมคำทำนายไพ่ทาโรต์ทุกหัวข้อ — ความรัก การงาน การเงิน อนาคต ค้นหาตามหมวดหมู่ได้',
};

export default function ReadingsPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">คลังคำทำนายทั้งหมด</span>
            <h1 className="section-title">ดูคำทำนายทั้งหมด</h1>
            <p className="section-subtitle">เลือกหัวข้อที่ตรงกับใจคุณ ค้นหาหรือกรองตามหมวดหมู่ได้ตามต้องการ</p>
          </div>
          <ReadingsBrowser />
        </div>
      </section>
    </main>
  );
}
