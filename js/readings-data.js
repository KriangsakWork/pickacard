// ============================================
// ALL READINGS — content catalog
// Single source of truth for the /readings page.
// To add a new reading, append one entry to READING_ITEMS.
// ============================================

// Categories used to group and filter readings.
// "all" is a virtual bucket shown as the first filter chip.
const READING_CATEGORIES = [
  { key: 'all',          label: 'ทั้งหมด',      emoji: '🔮' },
  { key: 'love',         label: 'ความรัก',      emoji: '💜' },
  { key: 'relationship', label: 'ความสัมพันธ์', emoji: '🌙' },
  { key: 'work',         label: 'การงาน',       emoji: '💼' },
  { key: 'finance',      label: 'การเงิน',      emoji: '💰' },
  { key: 'future',       label: 'อนาคต',        emoji: '✨' },
  { key: 'healing',      label: 'Healing',      emoji: '🕯️' }
];

// Each entry carries sort metadata (popularity, ctr, publishedAt) so the
// page can later add sorting / pagination without reshaping the data.
const READING_ITEMS = [
  {
    slug: 'his-feelings',
    url: '/reading/his-feelings.html',
    title: 'เขาคิดยังไงกับคุณ',
    hook: 'สำรวจความรู้สึกที่ซ่อนอยู่ลึก ๆ ในใจของเขา',
    image: '/images/banners/banner-his-feelings.png',
    category: 'love',
    featured: true,
    popularity: 99,
    ctr: 0.46,
    publishedAt: '2026-03-02'
  },
  {
    slug: 'missing-you',
    url: '/reading/missing-you.html',
    title: 'คนนั้นยังคิดถึงคุณไหม',
    hook: 'รู้ว่าคนที่คุณคิดถึง เขายังมีคุณอยู่ในใจหรือเปล่า',
    image: '/images/banners/banner-missing-you.png',
    category: 'love',
    featured: true,
    popularity: 97,
    ctr: 0.44,
    publishedAt: '2026-03-09'
  },
  {
    slug: 'love-comeback',
    url: '/reading/love-comeback.html',
    title: 'รักเก่าจะหวนคืนไหม',
    hook: 'คำตอบสำหรับใจที่ยังไม่อาจลืมความรักครั้งก่อน',
    image: '/images/banners/banner-love-return.png',
    category: 'love',
    featured: true,
    popularity: 95,
    ctr: 0.43,
    publishedAt: '2026-03-16'
  },
  {
    slug: 'when-meet-soulmate',
    url: '/reading/when-meet-soulmate.html',
    title: 'เมื่อไหร่จะเจอเนื้อคู่',
    hook: 'ไพ่บอกจังหวะเวลาที่คนที่ใช่จะเข้ามาในชีวิตคุณ',
    image: '/images/banners/banner-soulmate.png',
    category: 'love',
    featured: true,
    popularity: 92,
    ctr: 0.42,
    publishedAt: '2026-05-25'
  },
  {
    slug: 'soulmate',
    url: '/reading/soulmate.html',
    title: 'เนื้อคู่ของคุณคือใคร',
    hook: 'ค้นหาภาพคนที่จักรวาลกำลังเตรียมไว้ให้คุณ',
    image: '/images/banners/banner-soulmate.png',
    category: 'relationship',
    featured: true,
    popularity: 90,
    ctr: 0.40,
    publishedAt: '2026-03-23'
  },
  {
    slug: 'universe-message',
    url: '/reading/universe-message.html',
    title: 'ข้อความจากจักรวาล',
    hook: 'เปิดรับข้อความที่จักรวาลอยากกระซิบบอกคุณในวันนี้',
    image: '/images/banners/banner-universe-message.png',
    category: 'healing',
    featured: true,
    popularity: 86,
    ctr: 0.39,
    publishedAt: '2026-04-20'
  },
  {
    slug: 'fortune',
    url: '/reading/fortune.html',
    title: 'โชคลาภที่กำลังจะมา',
    hook: 'ทิศทางการเงินและโอกาสที่กำลังรออยู่ในช่วงนี้',
    image: '/images/banners/banner-luck.png',
    category: 'finance',
    featured: true,
    popularity: 88,
    ctr: 0.37,
    publishedAt: '2026-04-06'
  },
  {
    slug: 'future-opportunity',
    url: '/reading/future-opportunity.html',
    title: 'โอกาสในอนาคต',
    hook: 'สิ่งที่กำลังจะเดินทางเข้ามาในชีวิตของคุณ',
    image: '/images/banners/banner-future-opportunity.png',
    category: 'future',
    featured: false,
    popularity: 80,
    ctr: 0.34,
    publishedAt: '2026-03-30'
  },
  {
    slug: 'let-go',
    url: '/reading/let-go.html',
    title: 'สิ่งที่ต้องปล่อยวาง',
    hook: 'รู้ว่าอะไรในชีวิตที่จักรวาลขอให้คุณวางลง',
    image: '/images/banners/banner-let-go.png',
    category: 'healing',
    featured: false,
    popularity: 76,
    ctr: 0.33,
    publishedAt: '2026-04-27'
  },
  {
    slug: 'investment',
    url: '/reading/investment.html',
    title: 'การลงทุนที่เหมาะกับคุณ',
    hook: 'ค้นหาสไตล์การลงทุนที่ใช่กับนิสัยและจังหวะชีวิตของคุณ',
    image: '/images/banners/banner-investment.png',
    category: 'finance',
    featured: false,
    popularity: 70,
    ctr: 0.30,
    publishedAt: '2026-04-13'
  },
  {
    slug: 'right-job',
    url: '/reading/right-job.html',
    title: 'งานที่ใช่สำหรับคุณ',
    hook: 'ค้นหางานที่คุณถูกสร้างมาเพื่อทำอย่างแท้จริง',
    image: '/images/banners/banner-right-job.png',
    category: 'work',
    featured: false,
    popularity: 68,
    ctr: 0.29,
    publishedAt: '2026-04-03'
  },
  {
    slug: 'coworkers',
    url: '/reading/coworkers.html',
    title: 'เพื่อนร่วมงานคิดยังไงกับคุณ',
    hook: 'ส่องภาพลักษณ์ของคุณในสายตาเพื่อนร่วมทีม',
    image: '/images/banners/banner-coworkers.png',
    category: 'work',
    featured: false,
    popularity: 62,
    ctr: 0.27,
    publishedAt: '2026-04-17'
  }
];
