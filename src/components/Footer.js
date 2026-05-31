import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <Image src="/images/logo.webp" alt="Pick Mystic logo" width={32} height={32} />
              <span className="nav-brand">
                <span className="nav-brand-name">PICK MYSTIC</span>
                <span className="nav-brand-tagline">Pick a Card Tarot</span>
              </span>
            </Link>
            <p className="footer-tagline">
              ✦ ทุกการเลือก คือก้าวเล็กๆ ที่พาเราไปสู่สิ่งที่ดีกว่า ✦
            </p>
          </div>
          <nav className="footer-nav" aria-label="ลิงก์ส่วนท้าย">
            <Link href="/blog">บทความ</Link>
            <Link href="/cards">ความหมายไพ่</Link>
            <Link href="/about">เกี่ยวกับเรา</Link>
            <Link href="/how-to">วิธีการใช้งาน</Link>
            <Link href="/faq">คำถามที่พบบ่อย</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} Pick Mystic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
