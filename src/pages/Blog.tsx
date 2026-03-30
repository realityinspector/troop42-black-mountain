import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { parseISO } from 'date-fns';
import { Plus, PenLine, BookOpen } from 'lucide-react';
import SEO from '@/components/SEO';
import AnimatedSection from '@/components/AnimatedSection';
import { TreeIcon } from '@/assets/brand/icons';
import { getPosts } from '@/lib/api';
import type { Post } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import BlogCard, { resolvePostCategory, type PostCategory } from '@/components/BlogCard';

type CategoryFilter = 'ALL' | PostCategory;

const filterTabs: { value: CategoryFilter; label: string }[] = [
  { value: 'ALL', label: 'All Posts' },
  { value: 'SCOUTMASTER_NOTE', label: "Scoutmaster's Notes" },
  { value: 'ANNOUNCEMENT', label: 'Announcements' },
  { value: 'BLOG', label: 'Trail Stories' },
];

const POSTS_PER_PAGE = 8;

export default function Blog() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(
    (searchParams.get('category') as CategoryFilter) || 'ALL'
  );
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError('Unable to load posts. Please try again later.');
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (categoryFilter !== 'ALL') params.category = categoryFilter;
    setSearchParams(params, { replace: true });
  }, [categoryFilter, setSearchParams]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [categoryFilter]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(
        (p) => resolvePostCategory(p) === categoryFilter
      );
    }
    return filtered.sort(
      (a, b) =>
        parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
    );
  }, [posts, categoryFilter]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // Latest Scoutmaster's Note for the highlighted section
  const latestScoutmasterNote = useMemo(() => {
    return (
      posts
        .filter((p) => resolvePostCategory(p) === 'SCOUTMASTER_NOTE')
        .sort(
          (a, b) =>
            parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
        )[0] || null
    );
  }, [posts]);

  return (
    <>
      <SEO
        title="The Trail Journal"
        description="Stories from the trail, scoutmaster's notes, and announcements from Troop 42 Black Mountain."
      />

      {/* Hero Banner */}
      <section className="topo-bg py-16 sm:py-20 relative overflow-hidden">
        <div className="container-wide relative z-10">
          <AnimatedSection direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TreeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-scout-gold" />
            </div>
            <h1 className="text-center font-heading text-4xl sm:text-5xl font-bold text-white">
              The Trail Journal
            </h1>
            <p className="text-center text-scout-meadow/80 font-body mt-3 text-lg max-w-xl mx-auto">
              Stories from the trail, wisdom from the campfire, and news from our
              troop family.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="container-wide py-10 sm:py-14">
        {/* Scoutmaster's Corner */}
        {latestScoutmasterNote && categoryFilter === 'ALL' && !loading && (
          <AnimatedSection direction="up" delay={0.1}>
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-scout-bark mb-5 flex items-center gap-2">
                <PenLine size={22} className="text-scout-earth" />
                Scoutmaster's Corner
              </h2>

              <Link
                to={`/blog/${latestScoutmasterNote.slug}`}
                className="block group"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="parchment-bg rounded-xl shadow-md border border-scout-khaki/30 overflow-hidden"
                >
                  <div className="p-6 sm:p-8 md:flex md:gap-8">
                    {/* Left: Decorative Journal Motif */}
                    <div className="hidden md:flex flex-shrink-0 w-32 items-start justify-center pt-2">
                      <div className="relative">
                        <div className="w-20 h-28 bg-scout-earth/10 rounded border border-scout-khaki/40 flex items-center justify-center">
                          <PenLine
                            size={32}
                            className="text-scout-earth/40"
                            strokeWidth={1.2}
                          />
                        </div>
                        {/* Decorative lines suggesting a journal */}
                        <div className="absolute -bottom-2 -right-2 w-20 h-28 bg-scout-earth/5 rounded border border-scout-khaki/20 -z-10" />
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-scout-earth bg-scout-khaki/20 px-2.5 py-1 rounded-full mb-3">
                        <PenLine size={11} />
                        Scoutmaster's Note
                      </span>

                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-scout-bark group-hover:text-scout-forest transition-colors leading-snug">
                        {latestScoutmasterNote.title}
                      </h3>

                      <p className="mt-3 text-scout-slate/80 font-body leading-relaxed line-clamp-3">
                        {latestScoutmasterNote.excerpt ||
                          latestScoutmasterNote.content
                            .replace(/<[^>]*>/g, '')
                            .slice(0, 220)}
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-xs text-scout-earth/60 font-body">
                        <span className="font-medium">
                          {latestScoutmasterNote.author?.name || 'Troop 42'}
                        </span>
                        <span>
                          {new Date(
                            latestScoutmasterNote.createdAt
                          ).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <span className="inline-block mt-4 text-sm font-body font-semibold text-scout-forest group-hover:underline underline-offset-2">
                        Read the full note &rarr;
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </AnimatedSection>
        )}

        {/* Controls */}
        <AnimatedSection direction="up" delay={0.15}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setCategoryFilter(tab.value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                    categoryFilter === tab.value
                      ? 'bg-scout-forest text-white'
                      : 'bg-scout-mist/50 text-scout-slate hover:bg-scout-mist hover:text-scout-navy'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isAdmin && (
              <Link to="/admin/posts/new" className="btn-primary text-sm gap-2">
                <Plus size={16} />
                New Post
              </Link>
            )}
          </div>
        </AnimatedSection>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-scout-mist border-t-scout-forest" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-scout-campfire font-body text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline mt-4 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && (
          <AnimatedSection direction="up" delay={0.2}>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen
                  size={48}
                  className="mx-auto text-scout-khaki/40 mb-4"
                  strokeWidth={1.2}
                />
                <p className="font-heading text-xl text-scout-slate/60">
                  No posts yet.
                </p>
                <p className="font-body text-scout-slate/40 mt-1">
                  Stories from the trail are on their way.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visiblePosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() =>
                        setVisibleCount((prev) => prev + POSTS_PER_PAGE)
                      }
                      className="btn-outline text-sm"
                    >
                      Load More Posts
                    </button>
                  </div>
                )}
              </>
            )}
          </AnimatedSection>
        )}
      </section>
    </>
  );
}
