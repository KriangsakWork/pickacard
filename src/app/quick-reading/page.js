import QuickReadingExperience from '@/components/QuickReadingExperience';

export const metadata = {
  title: 'ดูดวงจากคำถาม เปิดไพ่ทาโรต์ 3 ใบ ฟรี',
  description:
    'พิมพ์คำถามที่คุณอยากรู้ เรื่องความรัก การงาน การเงิน หรืออนาคต ระบบจะเปิดไพ่ทาโรต์ 3 ใบ พร้อมคำทำนายเฉพาะสำหรับคำถามของคุณ ฟรี ไม่ต้องสมัคร',
  alternates: { canonical: '/quick-reading' },
  openGraph: {
    type: 'website',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
  },
};

export default function QuickReadingPage() {
  return (
    <main className="container">
      <QuickReadingExperience />
    </main>
  );
}
