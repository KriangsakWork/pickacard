import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata = {
  title: "Pick Mystic — เปิดไพ่ทาโรต์ออนไลน์",
  description:
    "ทำนายไพ่ทาโรต์ฟรี รวดเร็ว แม่นยำ พร้อมมาสคอตน่ารัก ทำนายความรัก ความฝัน โชคลาภ และอื่นๆ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={prompt.variable}>
      <body>{children}</body>
    </html>
  );
}
