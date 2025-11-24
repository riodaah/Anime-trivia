import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, BlogPost } from '@/lib/blogApi';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

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

            <div className="prose prose-invert max-w-none prose-headings:text-white prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 prose-strong:text-white prose-img:rounded-lg prose-img:shadow-lg">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : post.contentMarkdown ? (
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    h1: ({ children }) => <h1 className="text-4xl font-bold mb-6 mt-8">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-3xl font-bold mb-4 mt-6">{children}</h2>,
                    h3: ({ children}) => <h3 className="text-2xl font-bold mb-3 mt-4">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        {children}
                      </a>
                    ),
                    img: ({ src, alt }) => (
                      <img src={src} alt={alt || ''} className="w-full rounded-lg shadow-lg my-6" />
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-400">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">{children}</code>
                    ),
                  }}
                >
                  {post.contentMarkdown}
                </ReactMarkdown>
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

