import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Trash2,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  ListChecks,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/SEO';
import AdminSidebar from '@/components/AdminSidebar';
import RichTextEditor from '@/components/RichTextEditor';
import AIContentGenerator from '@/components/AIContentGenerator';
import { useAuth } from '@/hooks/useAuth';
import { getResources, createResource, updateResource, deleteResource } from '@/lib/api';
import type { Resource } from '@/lib/api';

const RESOURCE_CATEGORIES = [
  { value: 'PACKING_LIST', label: 'Packing List' },
  { value: 'GEAR_GUIDE', label: 'Gear Guide' },
  { value: 'MERIT_BADGE', label: 'Merit Badge' },
  { value: 'GENERAL', label: 'General' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function convertToChecklist(html: string): string {
  // Convert lines into a checklist-style HTML
  const lines = html
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return html;

  const items = lines.map((line) => `<li>${line}</li>`).join('\n');
  return `<ul>\n${items}\n</ul>`;
}

export default function EditResource() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [category, setCategory] = useState<Resource['category']>('GENERAL');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const existingResource = useRef<Resource | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Load existing resource
  useEffect(() => {
    if (isNew || !user) return;

    async function load() {
      try {
        const resources = await getResources();
        const resource = resources.find((r) => r.id === id);
        if (!resource) {
          toast.error('Resource not found.');
          navigate('/admin/resources', { replace: true });
          return;
        }
        existingResource.current = resource;
        setTitle(resource.title);
        setSlug(resource.slug);
        setSlugManual(true);
        setCategory(resource.category || 'GENERAL');
        setDescription(resource.description || '');
        setContent(resource.content || '');
        setPublished(resource.published);
      } catch {
        toast.error('Failed to load resource.');
        navigate('/admin/resources', { replace: true });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, isNew, user, navigate]);

  // Auto-generate slug
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const handleSave = async (shouldPublish?: boolean) => {
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }

    setSaving(true);
    const data: Partial<Resource> = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      category,
      description: description.trim() || undefined,
      content,
      published: shouldPublish !== undefined ? shouldPublish : published,
    };

    try {
      if (isNew) {
        const created = await createResource(data);
        toast.success('Resource created!');
        navigate(`/admin/resources/${created.id}`, { replace: true });
      } else {
        await updateResource(existingResource.current!.id, data);
        if (shouldPublish !== undefined) setPublished(shouldPublish);
        toast.success('Resource saved!');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save resource.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingResource.current) return;
    setDeleting(true);
    try {
      await deleteResource(existingResource.current.id);
      toast.success('Resource deleted.');
      navigate('/admin/resources', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete resource.';
      toast.error(message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleAIInsert = (html: string) => {
    setContent((prev) => prev + html);
  };

  const handleFormatAsChecklist = () => {
    const converted = convertToChecklist(content);
    setContent(converted);
    toast.success('Content formatted as a checklist.');
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
      <SEO title={isNew ? 'New Resource' : `Edit: ${title}`} />
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
                  to="/admin/resources"
                  className="p-2 rounded-lg hover:bg-scout-khaki/20 text-scout-slate transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="font-heading text-2xl font-bold text-scout-navy">
                  {isNew ? 'New Resource' : 'Edit Resource'}
                </h1>
              </div>

              {!isNew && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-scout-ember hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete resource"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
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
                  placeholder="Enter resource title"
                  className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                />
              </div>

              {/* Slug + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugify(e.target.value));
                      setSlugManual(true);
                    }}
                    placeholder="resource-url-slug"
                    className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-mono text-sm placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Resource['category'])}
                    className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                  >
                    {RESOURCE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief description of this resource..."
                  className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition resize-none"
                />
              </div>

              {/* AI Generator */}
              <AIContentGenerator onInsert={handleAIInsert} type="default" />

              {/* Packing List Helper */}
              {category === 'PACKING_LIST' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 bg-scout-gold/10 rounded-lg border border-scout-gold/20"
                >
                  <ListChecks className="w-5 h-5 text-scout-gold flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-body font-semibold text-scout-navy">
                      Packing List Mode
                    </p>
                    <p className="text-xs font-body text-scout-slate mt-0.5">
                      Write items on separate lines, then format as a checklist.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleFormatAsChecklist}
                    className="px-3 py-1.5 bg-scout-gold text-white text-xs font-body font-semibold rounded-lg hover:bg-scout-amber transition-colors"
                  >
                    Format as Checklist
                  </button>
                </motion.div>
              )}

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                  Content
                </label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your resource content here..."
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-scout-khaki/30">
                <div>
                  <p className="text-sm font-body font-semibold text-scout-navy">Published</p>
                  <p className="text-xs font-body text-scout-slate mt-0.5">
                    {published ? 'This resource is visible on the site.' : 'This resource is saved as a draft.'}
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
                  {isNew ? 'Create Resource' : 'Save Changes'}
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
                  to="/admin/resources"
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
                  <h3 className="font-heading text-lg font-bold text-scout-navy">Delete Resource</h3>
                  <p className="text-sm font-body text-scout-slate">This cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm font-body text-scout-navy mb-6">
                Are you sure you want to delete &ldquo;{title}&rdquo;?
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
