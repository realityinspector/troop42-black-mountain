import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Pencil,
  PenLine,
  BookOpen,
  Megaphone,
  LinkIcon,
  Check,
} from 'lucide-react';
import SEO from '@/components/SEO';
import AnimatedSection from '@/components/AnimatedSection';
import { getPost, getPosts } from '@/lib/api';
import type { Post } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { resolvePostCategory } from '@/components/BlogCard';

const categoryStyles: Record<
  string,
  { label: string; icon: typeof PenLine; color: string; bg: string }
> = {
  BLOG: {
    label: 'Trail Story',
    icon: BookOpen,
    color: 'text-scout-pine',
    bg: 'bg-scout-pine/10',
  },
  SCOUTMASTER_NOTE: {
    label: "Scoutmaster's Note",
    icon: PenLine,
    color: 'text-scout-earth',
    bg: 'bg-scout-parchment',
  },
  ANNOUNCEMENT: {
    label: 'Announcement',
    icon: Megaphone,
    color: 'text-scout-campfire',
    bg: 'bg-orange-50',
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [prevPost, setPrevPost] = useState<Post | null>(null);
  const [nextPost, setNextPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const postData = await getPost(slug);
        setPost(postData);

        // Fetch all posts to find prev/next
        try {
          const allPosts = await getPosts();
          const sorted = allPosts.sort(
            (a: Post, b: Post) =>
              parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
          );
          const currentIndex = sorted.findIndex((p: Post) => p.slug === slug);
          if (currentIndex > 0) {
            setNextPost(sorted[currentIndex - 1]);
          } else {
            setNextPost(null);
          }
          if (currentIndex < sorted.length - 1) {
            setPrevPost(sorted[currentIndex + 1]);
          } else {
            setPrevPost(null);
          }
        } catch {
          // Navigation posts are non-critical
        }
      } catch (err) {
        setError('Post not found.');
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-scout-mist border-t-scout-forest" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container-narrow py-20 text-center">
        <p className="font-heading text-2xl text-scout-slate/60 mb-4">
          {error || 'Post not found'}
        </p>
        <Link to="/blog" className="btn-outline text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Back to Trail Journal
        </Link>
      </div>
    );
  }

  const date = parseISO(post.createdAt);
  const category = resolvePostCategory(post);
  const style = categoryStyles[category] || categoryStyles.BLOG;
  const Icon = style.icon;
  const isScoutmasterNote = category === 'SCOUTMASTER_NOTE';
  const authorName = post.author?.name || 'Troop 42';

  return (
    <>
      <SEO
        title={post.title}
        description={
          post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 155)
        }
      />

      {/* Breadcrumb */}
      <div className="bg-scout-cream border-b border-scout-khaki/20">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-2 text-sm font-body text-scout-slate/70">
            <Link
              to="/blog"
              className="hover:text-scout-forest transition-colors"
            >
              Trail Journal
            </Link>
            <ChevronRight size={14} />
            <span className="text-scout-navy font-medium truncate">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <article className={`${isScoutmasterNote ? 'bg-scout-parchment/20' : ''}`}>
        <div className="container-narrow py-10 sm:py-14">
          <AnimatedSection direction="up">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-scout-slate/70 hover:text-scout-forest transition-colors font-body mb-6"
            >
              <ArrowLeft size={14} />
              Back to Trail Journal
            </Link>

            {/* Category Badge + Admin Edit */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1 rounded-full ${style.bg} ${style.color}`}
              >
                <Icon size={12} />
                {style.label}
              </span>
              {isAdmin && (
                <Link
                  to={`/admin/posts/${post.id}/edit`}
                  className="inline-flex items-center gap-1.5 text-xs text-scout-slate/60 hover:text-scout-forest transition-colors"
                >
                  <Pencil size={12} />
                  Edit Post
                </Link>
              )}
            </div>

            {/* Title */}
            <h1
              className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${
                isScoutmasterNote ? 'text-scout-bark' : 'text-scout-navy'
              }`}
            >
              {post.title}
            </h1>

            {/* Author & Date */}
            <div className="mt-4 flex items-center gap-4 text-sm text-scout-slate/70 font-body">
              <span className="font-medium">{authorName}</span>
              <span className="text-scout-khaki">|</span>
              <time dateTime={post.createdAt}>
                {format(date, 'MMMM d, yyyy')}
              </time>
            </div>
          </AnimatedSection>

          {/* Featured Image */}
          {post.featuredImage && (
            <AnimatedSection direction="up" delay={0.1}>
              <div className="mt-8 rounded-xl overflow-hidden shadow-md">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto max-h-[480px] object-cover"
                />
              </div>
            </AnimatedSection>
          )}

          {/* Scoutmaster Note Decorative Header */}
          {isScoutmasterNote && !post.featuredImage && (
            <AnimatedSection direction="fade" delay={0.1}>
              <div className="mt-8 flex items-center gap-3 text-scout-earth/30">
                <div className="flex-1 h-px bg-scout-khaki/30" />
                <PenLine size={20} />
                <div className="flex-1 h-px bg-scout-khaki/30" />
              </div>
            </AnimatedSection>
          )}

          {/* Content */}
          <AnimatedSection direction="up" delay={0.15}>
            <div
              className={`mt-8 ${
                isScoutmasterNote
                  ? 'bg-white/60 rounded-xl p-6 sm:p-8 border border-scout-khaki/20 shadow-sm'
                  : ''
              }`}
            >
              <div
                className={`prose prose-lg max-w-none font-body
                  prose-headings:font-heading
                  prose-p:leading-relaxed
                  prose-a:underline-offset-2
                  prose-strong:font-semibold
                  prose-ul:leading-relaxed prose-ol:leading-relaxed
                  prose-li:marker:text-scout-sage
                  prose-blockquote:border-l-scout-gold prose-blockquote:bg-scout-cream/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
                  prose-img:rounded-lg prose-img:shadow-md
                  ${
                    isScoutmasterNote
                      ? 'prose-headings:text-scout-bark prose-p:text-scout-bark/80 prose-a:text-scout-earth hover:prose-a:text-scout-bark prose-strong:text-scout-bark'
                      : 'prose-headings:text-scout-navy prose-p:text-scout-slate prose-a:text-scout-pine hover:prose-a:text-scout-forest prose-strong:text-scout-navy'
                  }`}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </AnimatedSection>

          {/* Share */}
          <AnimatedSection direction="up" delay={0.2}>
            <div className="mt-10 pt-6 border-t border-scout-khaki/20">
              <div className="flex items-center gap-3">
                <span className="text-sm font-body text-scout-slate/60">
                  Share:
                </span>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 text-sm font-body text-scout-slate/70 hover:text-scout-forest transition-colors bg-scout-mist/50 hover:bg-scout-mist px-3 py-1.5 rounded-lg"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-scout-sage" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <LinkIcon size={14} />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Previous / Next Navigation */}
          <AnimatedSection direction="up" delay={0.25}>
            <nav className="mt-10 pt-6 border-t border-scout-khaki/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Previous (older) */}
                <div>
                  {prevPost && (
                    <Link
                      to={`/blog/${prevPost.slug}`}
                      className="group flex items-start gap-3 p-4 rounded-xl hover:bg-scout-mist/50 transition-colors"
                    >
                      <ChevronLeft
                        size={20}
                        className="mt-0.5 text-scout-slate/40 group-hover:text-scout-forest transition-colors flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-body text-scout-slate/50 uppercase tracking-wider">
                          Previous
                        </span>
                        <p className="font-heading font-semibold text-scout-navy group-hover:text-scout-forest transition-colors truncate mt-0.5">
                          {prevPost.title}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Next (newer) */}
                <div className="sm:text-right">
                  {nextPost && (
                    <Link
                      to={`/blog/${nextPost.slug}`}
                      className="group flex items-start gap-3 p-4 rounded-xl hover:bg-scout-mist/50 transition-colors sm:flex-row-reverse sm:text-left"
                    >
                      <ChevronRight
                        size={20}
                        className="mt-0.5 text-scout-slate/40 group-hover:text-scout-forest transition-colors flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-body text-scout-slate/50 uppercase tracking-wider">
                          Next
                        </span>
                        <p className="font-heading font-semibold text-scout-navy group-hover:text-scout-forest transition-colors truncate mt-0.5">
                          {nextPost.title}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          </AnimatedSection>
        </div>
      </article>
    </>
  );
}
