# Pick Mystic — เว็บดูดวงไพ่ทาโรต์ออนไลน์

**pickmystic.com** — ดูดวงไพ่ทาโรต์ฟรี ทำนายความรัก การงาน การเงิน

## Tech Stack

- **Next.js 16** (App Router) + React 19
- **Sanity CMS** — จัดการ content: บทความ, Pick Topics, ไพ่ทาโรต์
- **Tailwind CSS v4**
- **Vercel** — deploy + ISR

## โครงสร้างไฟล์

```
src/
├── app/
│   ├── page.js                        (หน้าแรก)
│   ├── layout.js                      (root layout)
│   ├── about/page.js
│   ├── faq/page.js
│   ├── how-to/page.js
│   ├── quick-reading/page.js          (ดูดวงจากคำถาม)
│   ├── reading/[topic]/               (หน้า Pick a Card แยกตามหัวข้อ)
│   │   ├── page.js
│   │   └── ReadingClient.jsx
│   ├── readings/                      (หน้ารวมหัวข้อทั้งหมด)
│   │   ├── page.js
│   │   └── ReadingsListClient.jsx
│   ├── blog/
│   │   ├── page.js                    (หน้ารวมบทความ)
│   │   └── [slug]/page.js             (บทความแต่ละชิ้น)
│   ├── cards/
│   │   ├── page.js                    (คลังไพ่ทาโรต์)
│   │   └── [slug]/page.js             (ไพ่แต่ละใบ)
│   ├── sitemap.js
│   ├── robots.js
│   └── studio/[[...tool]]/page.js     (Sanity Studio)
│
├── components/
│   ├── Header.js / Footer.js
│   ├── ArticleCard.js
│   ├── CategoryFilter.js
│   ├── QuickReadingExperience.js
│   ├── LuckyColors.js
│   ├── PickTopicPromo.js
│   ├── RelatedArticles.js
│   ├── ReadingShareButtons.jsx
│   └── ...
│
├── sanity/
│   ├── client.js
│   ├── queries.js                     (GROQ queries ทั้งหมด)
│   ├── schemas/
│   │   ├── article.js
│   │   ├── pickTopic.js
│   │   ├── tarotCard.js
│   │   ├── category.js
│   │   └── homepagePicks.js
│   └── image.js
│
├── lib/
│   ├── cards.js
│   ├── tarot-meaning.js
│   ├── spread-generator.js
│   ├── category-detector.js
│   └── seo.js
│
└── data/tarot/
    ├── tarot-meanings.json
    ├── tarot-meanings-v2.json
    ├── spreads.json
    ├── category-keywords.json
    └── intent-keywords.json

scripts/
├── seed-tarot-cards.mjs               (seed ไพ่เข้า Sanity)
├── migrate-pick-topics.mjs            (migrate Pick Topics เข้า Sanity)
└── import-legacy-articles.mjs         (import บทความเก่าเข้า Sanity)

public/images/
├── tarot/                             (รูปไพ่ทั้งหมด .webp)
├── banners/                           (banner แต่ละหัวข้อดูดวง)
├── blog/                              (รูป thumbnail บทความ)
└── ...
```

## Core Features

### 1. Quick Card — ดูดวงจากคำถาม (`/quick-reading`)

ผู้ใช้พิมพ์คำถาม → ระบบตรวจจับหมวด → สุ่มไพ่ 3 ใบ → แสดงคำทำนายที่ tailored ตามหมวด

**Flow:**
1. `QuickReadingExperience.js` รับ input คำถาม
2. `lib/category-detector.js` วิเคราะห์ keyword → จัดหมวด (love / money / career / future ฯลฯ)
3. `lib/spread-generator.js` สุ่มไพ่แบบ `quick3` (3 ใบ: สถานการณ์ปัจจุบัน / สิ่งที่ซ่อนอยู่ / แนวโน้ม)
4. `lib/tarot-meaning.js` ดึงความหมายไพ่จาก `tarot-meanings-v2.json` ตรงกับหมวดนั้น
5. แสดงผล + สรุปคำทำนาย + คำแนะนำจากจักรวาล

**หมวดคำถามที่รองรับ:** love / reconciliation / crush / healing / luck / money / career / future
(ขยายได้ใน `src/data/tarot/category-keywords.json`)

**ทุกอย่าง client-side** — ไม่มีการเรียก API ภายนอก

---

### 2. Pick a Card — เลือกไพ่ตามหัวข้อ (`/reading/[topic]`)

ผู้ใช้เลือกหัวข้อ → กดเลือกกองไพ่ → รับคำทำนายที่เขียนไว้เฉพาะหัวข้อนั้น

**Flow:**
1. หน้า `/readings` แสดงรายการ `pickTopic` จาก Sanity
2. ผู้ใช้กดเข้า `/reading/[slug]` — page ดึงข้อมูล topic + results จาก Sanity (ISR 60s)
3. `ReadingClient.jsx` แสดง 4 กองไพ่ให้เลือก
4. เมื่อเลือกกอง → แสดง result ที่ตรงกับกองนั้น (เนื้อหาในแต่ละ result เขียนผ่าน Sanity Studio)

**เพิ่มหัวข้อใหม่:** สร้าง `pickTopic` document ใน Sanity Studio → กำหนด slug → ใส่ results 4 ชุด → Publish
(ไม่ต้องแตะโค้ด)

---

### 3. SEO

**Metadata (Next.js `generateMetadata`)**
- ทุก page มี `title`, `description`, `canonical`, `hreflang: th-TH`
- หน้า dynamic (`/reading/[topic]`, `/blog/[slug]`) ดึง metadata จาก Sanity field: `seo.metaTitle`, `seo.metaDescription`, `seo.ogImage`
- helper `truncate()` ใน `lib/seo.js` ตัดข้อความให้ไม่เกิน 60 / 160 ตัวอักษรอัตโนมัติ

**Structured Data (JSON-LD)**
- `BreadcrumbList` — ทุกหน้า reading และ blog
- `FAQPage` — สร้างอัตโนมัติจาก Portable Text ที่มี heading ลงท้ายด้วย "?"
- inject ผ่าน `<JsonLd>` component

**Open Graph / Twitter Card**
- OG image ดึงจาก `seo.ogImage` ของ Sanity → fallback เป็น `/images/og-image.webp`
- รองรับ `summary_large_image` สำหรับ Twitter

**Performance / Crawlability**
- ISR (`revalidate = 60`) — หน้า dynamic rebuild อัตโนมัติทุก 60 วินาทีหลัง deploy
- `sitemap.js` สร้าง XML sitemap จาก Sanity (articles + pick topics + cards) อัตโนมัติ
- `robots.js` block `/studio` ไม่ให้ crawl

---

## Sanity Content Types

| Schema | ใช้สำหรับ |
|---|---|
| `article` | บทความบล็อก |
| `pickTopic` | หัวข้อ Pick a Card (เช่น "คนนั้นคิดถึงคุณมั้ย") |
| `tarotCard` | ไพ่ทาโรต์แต่ละใบ + ความหมาย |
| `category` | หมวดหมู่บทความ |
| `homepagePicks` | ควบคุมการ์ดที่แสดงหน้าแรก |

## วิธีพัฒนา

```bash
npm install
npm run dev          # http://localhost:3000
```

Sanity Studio อยู่ที่ `/studio`

## Scripts

```bash
npm run seed:tarot        # seed ข้อมูลไพ่ทาโรต์เข้า Sanity
npm run migrate:pick      # migrate Pick Topics เข้า Sanity
```

## วิธีเพิ่มหัวข้อดูดวงใหม่

1. เพิ่ม `pickTopic` document ใน Sanity Studio
2. ใส่ `slug` ที่ต้องการ (เช่น `love-return`)
3. หน้า `/reading/[slug]` จะ render ให้อัตโนมัติ

## วิธีเพิ่มบทความใหม่

1. เขียนใน Sanity Studio → Articles
2. กด Publish — หน้า `/blog/[slug]` จะขึ้นภายใน 60 วินาที (ISR)

## Deploy

Vercel — auto-deploy เมื่อ push ไป `main`
