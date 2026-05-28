import { notFound } from 'next/navigation';
import ReadingExperience from '@/components/ReadingExperience';
import { READING_ITEMS } from '@/data/readings-list';

const TOPIC_SLUGS = READING_ITEMS.map(i => i.slug);

function findTopic(slug) {
  return READING_ITEMS.find(i => i.slug === slug);
}

async function loadReadings(slug) {
  try {
    const mod = await import(`@/data/readings/${slug}.js`);
    return mod.READINGS;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return TOPIC_SLUGS.map(topic => ({ topic }));
}

export async function generateMetadata({ params }) {
  const { topic: slug } = await params;
  const topic = findTopic(slug);
  if (!topic) return {};
  return {
    title: `${topic.title} | ดูดวงด้วยไพ่ทาโรต์ฟรี`,
    description: topic.hook,
    openGraph: {
      title: topic.title,
      description: topic.hook,
      images: [topic.image],
    },
  };
}

export default async function ReadingTopicPage({ params }) {
  const { topic: slug } = await params;
  const topicData = findTopic(slug);
  const readings = await loadReadings(slug);
  if (!topicData || !readings) notFound();

  return (
    <main className="container">
      <ReadingExperience topic={topicData} readings={readings} />
    </main>
  );
}
