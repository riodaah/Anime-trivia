import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, BlogPost } from '@/lib/blogApi';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { MotionFadeIn } from '@/components/ui/MotionFadeIn';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        try {
          const postData = await getPostBySlug(slug);
          setPost(postData);
        } catch (error) {
          console.error('Error fetching post:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="section-container py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="section-container py-20">
        <div className="card-glow p-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Post no encontrado</h1>
          <Link to="/blog" className="text-blue-400 hover:text-blue-300">
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-20">
      <MotionFadeIn>
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver al blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <div className="card-glow p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-400 mb-6">
              <Calendar size={20} className="mr-2" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm"
                  >
                    <Tag size={14} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {post.coverImageUrl && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* AdSense dentro del post */}
            <div className="mb-8">
              {/* <AdSense adSlot="1234567897" adFormat="horizontal" /> */}
              <div className="h-24 bg-dark-surface rounded-lg flex items-center justify-center text-gray-500 text-sm">
                Zona para Google AdSense (Dentro del post)
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : post.contentMarkdown ? (
                <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                  {post.contentMarkdown}
                </div>
              ) : (
                <p className="text-gray-300">{post.summary}</p>
              )}
            </div>

            {post.sourceUrl && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Fuente original →
                </a>
              </div>
            )}
          </div>
        </article>
      </MotionFadeIn>
    </div>
  );
}

