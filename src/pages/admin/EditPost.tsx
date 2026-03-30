import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Trash2,
  Eye,
  Loader2,
  ArrowLeft,
  Check,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/SEO';
import AdminSidebar from '@/components/AdminSidebar';
import RichTextEditor from '@/components/RichTextEditor';
import AIContentGenerator from '@/components/AIContentGenerator';
import { useAuth } from '@/hooks/useAuth';
import { getPost, createPost, updatePost, deletePost, getPosts } from '@/lib/api';
import type { Post } from '@/lib/api';

const CATEGORIES = [
  { value: 'BLOG', label: 'Blog Post' },
  { value: 'SCOUTMASTER_NOTE', label: "Scoutmaster's Note" },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [category, setCategory] = useState<Post['category']>('BLOG');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const existingPost = useRef<Post | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Load existing post
  useEffect(() => {
    if (isNew || !user) return;

    async function load() {
      try {
        // Try to find the post by ID from the list
        const posts = await getPosts();
        const post = posts.find((p) => p.id === id);
        if (!post) {
          // Maybe it's a slug
          const bySlug = await getPost(id!).catch(() => null);
          if (!bySlug) {
            toast.error('Post not found.');
            navigate('/admin/posts', { replace: true });
            return;
          }
          fillForm(bySlug);
        } else {
          fillForm(post);
        }
      } catch {
        toast.error('Failed to load post.');
        navigate('/admin/posts', { replace: true });
      } finally {
        setLoading(false);
      }
    }

    function fillForm(post: Post) {
      existingPost.current = post;
      setTitle(post.title);
      setSlug(post.slug);
      setSlugManual(true);
      setCategory(post.category || 'BLOG');
      setExcerpt(post.excerpt || '');
      setImageUrl(post.featuredImage || post.imageUrl || '');
      setContent(post.content || '');
      setPublished(post.published);
    }

    load();
  }, [id, isNew, user, navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  // Auto-save (debounced)
  const triggerAutoSave = useCallback(() => {
    if (isNew || !existingPost.current) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaveStatus('saving');
      try {
        await updatePost(existingPost.current!.id, {
          title,
          slug,
          category,
          excerpt,
          featuredImage: imageUrl || null,
          content,
          published,
        });
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch {
        setAutoSaveStatus('idle');
      }
    }, 5000);
  }, [title, slug, category, excerpt, imageUrl, content, published, isNew]);

  useEffect(() => {
    triggerAutoSave();
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [triggerAutoSave]);

  const handleSave = async (shouldPublish?: boolean) => {
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required.');
      return;
    }

    setSaving(true);
    const data: Partial<Post> = {
      title: title.trim(),
      slug: slug.trim(),
      category: category as Post['category'],
      excerpt: excerpt.trim() || null,
      featuredImage: imageUrl.trim() || null,
      content,
      published: shouldPublish !== undefined ? shouldPublish : published,
    };

    try {
      if (isNew) {
        const created = await createPost(data);
        toast.success('Post created!');
        navigate(`/admin/posts/${created.id}`, { replace: true });
      } else {
        await updatePost(existingPost.current!.id, data);
        if (shouldPublish !== undefined) setPublished(shouldPublish);
        toast.success('Post saved!');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save post.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingPost.current) return;
    setDeleting(true);
    try {
      await deletePost(existingPost.current.id);
      toast.success('Post deleted.');
      navigate('/admin/posts', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete post.';
      toast.error(message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleAIInsert = (html: string) => {
    setContent((prev) => prev + html);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-scout-cream">
        <AdminSidebar />
        <main className="lg:pl-64 pt-16 lg:pt-0">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-scout-forest" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <SEO title={isNew ? 'New Post' : `Edit: ${title}`} />
      <div className="min-h-screen bg-scout-cream">
        <AdminSidebar />
        <main className="lg:pl-64 pt-16 lg:pt-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-3">
                <Link
                  to="/admin/posts"
                  className="p-2 rounded-lg hover:bg-scout-khaki/20 text-scout-slate transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="font-heading text-2xl font-bold text-scout-navy">
                    {isNew ? 'New Post' : 'Edit Post'}
                  </h1>
                  {autoSaveStatus === 'saving' && (
                    <p className="text-xs font-body text-scout-slate mt-0.5">Saving...</p>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <p className="text-xs font-body text-scout-sage mt-0.5 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isNew && (
                  <Link
                    to={`/blog/${slug}`}
                    target="_blank"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-body font-semibold text-scout-slate border border-scout-khaki/40 rounded-lg hover:bg-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Link>
                )}
                {!isNew && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 text-scout-ember hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                  Title <span className="text-scout-ember">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                  Slug <span className="text-scout-ember">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugManual(true);
                  }}
                  placeholder="post-url-slug"
                  className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-mono text-sm placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                />
                {!slugManual && slug && (
                  <p className="text-xs font-body text-scout-slate mt-1">Auto-generated from title</p>
                )}
              </div>

              {/* Row: Category + Featured Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Post['category'])}
                    className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="A brief summary of this post..."
                  className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition resize-none"
                />
              </div>

              {/* AI Generator */}
              <AIContentGenerator onInsert={handleAIInsert} type="blog_post" />

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                  Content
                </label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your post content here..."
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-scout-khaki/30">
                <div>
                  <p className="text-sm font-body font-semibold text-scout-navy">Published</p>
                  <p className="text-xs font-body text-scout-slate mt-0.5">
                    {published ? 'This post is visible on the site.' : 'This post is saved as a draft.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    published ? 'bg-scout-forest' : 'bg-scout-khaki/50'
                  }`}
                >
                  <motion.div
                    animate={{ x: published ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-scout-khaki/30">
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isNew ? 'Create Post' : 'Save Changes'}
                </button>
                {!published && (
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publish Now
                  </button>
                )}
                <Link
                  to="/admin/posts"
                  className="px-4 py-2.5 text-sm font-body font-semibold text-scout-slate hover:text-scout-navy transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-scout-ember" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-scout-navy">Delete Post</h3>
                  <p className="text-sm font-body text-scout-slate">This cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm font-body text-scout-navy mb-6">
                Are you sure you want to delete &ldquo;{title}&rdquo;? This action is permanent.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-body font-semibold text-scout-slate hover:text-scout-navy transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-scout-ember text-white text-sm font-body font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
