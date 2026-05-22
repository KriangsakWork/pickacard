# Pick a Card — เว็บดูดวงออนไลน์

โครงสร้าง Content Hub: หน้าแรกเลือกหัวข้อดูดวง → คลิกการ์ดเข้าหน้า Pick a Card

## โครงสร้างไฟล์

```
duangjai/
├── index.html                       (หน้าแรก: Hero + Tabs + Topic cards)
├── about.html                       (เกี่ยวกับเรา)
├── how-to.html                      (วิธีการใช้งาน)
├── faq.html                         (คำถามที่พบบ่อย)
│
├── reading/
│   └── missing-you.html             (Pick a Card: คนนั้นคิดถึงคุณมั้ย)
│
├── blog/
│   ├── index.html                   (หน้ารวมบทความ)
│   ├── how-to-pick-a-card.html      (บทความ: Pick a Card คืออะไร)
│   └── tarot-love-meaning.html      (บทความ: ความหมายไพ่ทาโรต์ความรัก)
│
├── quick-reading.html               (ดูดวงจากคำถาม: พิมพ์คำถาม → เปิดไพ่ 3 ใบ)
│
├── data/
│   ├── tarot-meanings.json          (คลังความหมายไพ่ทาโรต์ — แยกเนื้อหาจาก UI)
│   └── intent-keywords.json         (คีย์เวิร์ดตรวจจับหมวดคำถาม + เทมเพลตคำทำนาย)
│
├── css/style.css                    (สไตล์ทั้งหมด)
├── js/
│   ├── home.js                      (tabs filtering หน้าแรก)
│   ├── reading.js                   (logic หน้า reading)
│   ├── tarot-engine.js              (interpretation engine — ใช้ซ้ำได้ ไม่ผูกกับ DOM)
│   ├── quick-reading.js             (page controller ของ quick-reading.html)
│   └── readings-missing-you.js      (ข้อมูลคำทำนาย)
│
└── images/                          (รูปทั้งหมด)
```

## ฟีเจอร์ "ดูดวงจากคำถาม" (Quick Reading 3 ใบ)

ผู้ใช้พิมพ์คำถาม → ตรวจจับหมวด (keyword matching) → สุ่มไพ่ 3 ใบ → ประกอบคำทำนายจากความหมายที่เตรียมไว้ ไม่มีการเรียก API หรือใช้ AI ทำงานฝั่ง client ทั้งหมด

**กฎสำคัญ:** ห้าม hardcode ความหมายไพ่ไว้ใน component — เก็บทุกอย่างใน `data/*.json`

วิธีขยายระบบ:
- **เพิ่มไพ่ใหม่** → เพิ่ม object ใน `cards` ของ `data/tarot-meanings.json` (ใส่ความหมายครบทุกหมวด + วางรูปใน `images/tarot/`)
- **เพิ่มหมวดคำถาม** → เพิ่ม category ใน `data/intent-keywords.json` พร้อม `keywords` แล้วเพิ่ม key หมวดนั้นใน `meanings` ของไพ่ทุกใบ
- **เพิ่มไพ่กลับหัว (reversed)** → เพิ่ม key `reversed` ในแต่ละหมวดของ `meanings` (schema รองรับไว้แล้ว)

## วิธีเพิ่มหัวข้อดูดวงใหม่ในอนาคต

1. สร้างไฟล์ `js/readings-[topic-name].js` เก็บคำทำนาย
2. Copy `reading/missing-you.html` เป็น `reading/[topic-name].html`
3. ใน HTML เปลี่ยน script ที่ load ให้ตรงกับชื่อไฟล์ใหม่
4. แก้ `index.html` ที่ topic card ของหัวข้อนั้น เปลี่ยน `class="topic-card disabled"` เป็น `<a href="/reading/[topic-name].html" class="topic-card">` พร้อมลบ `<div class="topic-soon">เร็วๆ นี้</div>`

## วิธีเพิ่มบทความใหม่

1. Copy `blog/how-to-pick-a-card.html` เป็น `blog/[article-slug].html`
2. แก้เนื้อหา + meta tags
3. เพิ่ม link ใน `blog/index.html` และ `index.html` (ส่วน latest articles)

## Deploy

Static site - ใช้กับ Vercel ได้ทันที (auto-deploy เมื่อ push GitHub)
