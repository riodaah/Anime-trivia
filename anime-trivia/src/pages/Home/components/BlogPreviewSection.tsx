import { useEffect, useState } from 'react';
import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { getLatestPosts, BlogPost } from '@/lib/blogApi';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const BlogPreviewSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const latestPosts = await getLatestPosts(3);
        setPosts(latestPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="section-container py-20 bg-dark-surface">
      <MotionFadeIn>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient">
            Últimas Noticias
          </h2>
          <Link
            to="/blog"
            className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
          >
            <span>Ver todas</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Próximamente: noticias de anime
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glow overflow-hidden group cursor-pointer"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <Calendar size={16} className="mr-2" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {post.summary}
                    </p>
                    <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300">
                      <span className="text-sm">Leer más</span>
                      <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </MotionFadeIn>

      {/* Zona para AdSense - Entre posts */}
      <div className="mt-16">
        {/* <AdSense adSlot="1234567891" adFormat="horizontal" /> */}
        <div className="h-24 bg-dark-surface rounded-lg flex items-center justify-center text-gray-500 text-sm">
          Zona para Google AdSense (Entre secciones)
        </div>
      </div>
    </section>
  );
};

