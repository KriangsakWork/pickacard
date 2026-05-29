import ArticleCard from '@/components/ArticleCard';

export default function RelatedArticles({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-semibold text-dark-purple">
        บทความที่เกี่ยวข้อง
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
}
