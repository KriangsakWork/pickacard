import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-lavender-bg">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✦</span>
          <span className="text-xl font-semibold text-dark-purple">Pick Mystic</span>
        </div>
        <nav className="hidden gap-7 text-sm text-muted-purple md:flex">
          <a href="#" className="hover:text-primary">เปิดไพ่</a>
          <a href="#" className="hover:text-primary">ความหมายไพ่</a>
          <a href="#" className="hover:text-primary">บทความ</a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-10 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <span className="inline-block rounded-full bg-lavender-light px-3 py-1 text-xs font-medium text-primary-700">
            ✦ ทำนายไพ่ทาโรต์ฟรี
          </span>
          <h1 className="mt-5 text-4xl leading-tight md:text-5xl">
            เปิดไพ่ทาโรต์
            <br />
            <span className="text-primary">รู้คำตอบจากจักรวาล</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-purple">
            ให้กระต่ายน้อยช่วยใบ้คำตอบจากจักรวาล แม่นยำ น่ารัก พร้อมความหมายไพ่ครบทั้ง 78 ใบ
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-md shadow-primary/30 transition hover:bg-primary-600">
              เริ่มเปิดไพ่ →
            </button>
            <button className="rounded-full border border-primary-100 bg-white px-6 py-3 text-sm font-medium text-primary-700 transition hover:bg-lavender-light">
              ดูความหมายไพ่
            </button>
          </div>
        </div>

        <div className="relative mx-auto flex h-72 w-72 items-center justify-center md:h-96 md:w-96">
          <div className="absolute inset-0 rounded-full bg-lavender-light opacity-70 blur-2xl" />
          <Image
            src="/images/mascot-hero.webp"
            alt="Pick Mystic mascot"
            width={400}
            height={400}
            priority
            className="relative drop-shadow-xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-2xl">หัวข้อยอดนิยม</h2>
        <p className="mt-1 text-sm text-muted-purple">เลือกหัวข้อที่ใจกำลังคิดถึง</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "ความรักกำลังจะกลับมา?", tag: "ความรัก" },
            { title: "โชคลาภที่กำลังจะมา", tag: "โชคลาภ" },
            { title: "งานที่ใช่สำหรับฉัน", tag: "การงาน" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="text-xs font-medium tracking-wider text-primary uppercase">
                {item.tag}
              </span>
              <h3 className="mt-2 text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-purple">
                เปิดไพ่ 3 ใบ เพื่อรับคำใบ้จากจักรวาล
              </p>
              <div className="mt-4 text-sm font-medium text-primary">เปิดไพ่ →</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
