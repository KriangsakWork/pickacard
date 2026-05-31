import { Prompt, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const SITE_URL = "https://pickmystic.com";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pick Mystic",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.webp`,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pick Mystic",
  url: SITE_URL,
  inLanguage: "th-TH",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?cat={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://pickmystic.com'),
  title: {
    default: "Pick Mystic — ดูดวงไพ่ทาโรต์ออนไลน์ฟรี",
    template: "%s | Pick Mystic",
  },
  description:
    "ดูดวงไพ่ทาโรต์ออนไลน์ฟรี เปิดไพ่ทำนายความรัก การงาน การเงิน แม่นยำ พร้อมคำทำนายละเอียดจากกระต่ายพ่อมด Pick Mystic",
  openGraph: {
    type: "website",
    siteName: "Pick Mystic",
    locale: "th_TH",
    images: [{ url: "/images/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@pickmystic",
    creator: "@pickmystic",
    images: ["/images/og-image.webp"],
  },
};

export const viewport = {
  themeColor: "#7E57C2",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${prompt.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        <Header />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
