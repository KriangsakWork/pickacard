import { Prompt, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

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
  icons: { icon: "/images/favicon.webp" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${prompt.variable} ${playfair.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
