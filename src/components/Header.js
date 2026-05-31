'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/blog', label: 'บทความ' },
  { href: '/about', label: 'เกี่ยวกับเรา' },
  { href: '/how-to', label: 'วิธีการใช้งาน' },
  { href: '/faq', label: 'คำถามที่พบบ่อย' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      document.body.classList.remove('home');
      setScrolled(false);
      return;
    }
    document.body.classList.add('home');
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('home');
    };
  }, [isHome]);

  return (
    <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <img src="/images/logo.webp" alt="Pick Mystic logo" width="36" height="36" />
          <span className="nav-brand">
            <span className="nav-brand-name">PICK MYSTIC</span>
            <span className="nav-brand-tagline">Pick a Card Tarot</span>
          </span>
        </Link>
        <div className={`nav-menu${open ? ' open' : ''}`}>
          {NAV.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const className = `nav-link${isActive ? ' active' : ''}`;
            return (
              <Link key={item.href} href={item.href} className={className}>{item.label}</Link>
            );
          })}
        </div>
        <button
          className="nav-toggle"
          aria-label="เมนู"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}
