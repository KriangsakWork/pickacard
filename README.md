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
├── css/style.css                    (สไตล์ทั้งหมด)
├── js/
│   ├── home.js                      (tabs filtering หน้าแรก)
│   ├── reading.js                   (logic หน้า reading)
│   └── readings-missing-you.js      (ข้อมูลคำทำนาย)
│
└── images/                          (รูปทั้งหมด)
```

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
