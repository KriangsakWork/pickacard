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
