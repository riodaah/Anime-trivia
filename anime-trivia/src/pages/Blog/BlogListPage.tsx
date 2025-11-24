import { useEffect, useState } from 'react';
import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { getPosts, BlogPost } from '@/lib/blogApi';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { posts: newPosts, lastDoc: newLastDoc } = await getPosts(10, lastDoc);
      if (lastDoc === null) {
        setPosts(newPosts);
      } else {
        setPosts([...posts, ...newPosts]);
      }
      setLastDoc(newLastDoc);
      setHasMore(newPosts.length === 10);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="section-container py-20">
      <MotionFadeIn>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
          Blog de Anime
        </h1>

        {/* Zona para AdSense - Banner arriba */}
        <div className="mb-8">
          {/* <AdSense adSlot="1234567895" adFormat="horizontal" /> */}
          <div className="h-24 bg-dark-surface rounded-lg flex items-center justify-center text-gray-500 text-sm">
            Zona para Google AdSense (Banner superior)
          </div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="card-glow p-12 text-center">
            <p className="text-gray-400 text-lg">Próximamente: noticias de anime</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {post.summary}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                        <span className="text-sm">Leer más</span>
                        <ArrowRight size={16} className="ml-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* AdSense entre posts (cada 3) */}
            {posts.length > 3 && (
              <div className="mt-8">
                {/* <AdSense adSlot="1234567896" adFormat="horizontal" /> */}
                <div className="h-24 bg-dark-surface rounded-lg flex items-center justify-center text-gray-500 text-sm">
                  Zona para Google AdSense (Entre posts)
                </div>
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadPosts}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}
          </>
        )}
      </MotionFadeIn>
    </div>
  );
}

