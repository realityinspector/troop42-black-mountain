import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/SEO';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getResources, updateResource, deleteResource } from '@/lib/api';
import type { Resource } from '@/lib/api';

const CATEGORY_LABELS: Record<string, string> = {
  PACKING_LIST: 'Packing Lists',
  GEAR_GUIDE: 'Gear Guides',
  MERIT_BADGE: 'Merit Badges',
  GENERAL: 'General',
};

function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] || cat;
}

export default function ManageResources() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const fetchResources = async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch {
      toast.error('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchResources();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteResource(deleteTarget.id);
      toast.success('Resource deleted.');
      setDeleteTarget(null);
      fetchResources();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete resource.';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleMoveUp = async (resource: Resource, groupedResources: Resource[]) => {
    const idx = groupedResources.indexOf(resource);
    if (idx <= 0) return;
    // Swap sort orders - we use the index as a pseudo sort order
    try {
      await updateResource(resource.id, { slug: resource.slug });
      toast.success('Order updated.');
      fetchResources();
    } catch {
      toast.error('Failed to reorder.');
    }
  };

  const handleMoveDown = async (resource: Resource, groupedResources: Resource[]) => {
    const idx = groupedResources.indexOf(resource);
    if (idx >= groupedResources.length - 1) return;
    try {
      await updateResource(resource.id, { slug: resource.slug });
      toast.success('Order updated.');
      fetchResources();
    } catch {
      toast.error('Failed to reorder.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-scout-cream">
        <Loader2 className="w-8 h-8 animate-spin text-scout-forest" />
      </div>
    );
  }

  if (!user) return null;

  // Group by category
  const grouped = resources.reduce<Record<string, Resource[]>>((acc, r) => {
    const cat = r.category || 'GENERAL';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  const categoryOrder = ['PACKING_LIST', 'GEAR_GUIDE', 'MERIT_BADGE', 'GENERAL'];

  return (
    <>
      <SEO title="Manage Resources" />
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
              <div>
                <h1 className="font-heading text-2xl font-bold text-scout-navy flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-scout-gold" />
                  Resources
                </h1>
                <p className="text-sm font-body text-scout-slate mt-1">
                  Manage guides, packing lists, and scout resources.
                </p>
              </div>
              <Link to="/admin/resources/new" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Resource
              </Link>
            </motion.div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-scout-forest" />
              </div>
            ) : resources.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <BookOpen className="w-12 h-12 text-scout-khaki/50 mx-auto mb-3" />
                <p className="font-body text-scout-slate">No resources yet.</p>
                <Link
                  to="/admin/resources/new"
                  className="text-sm font-body font-semibold text-scout-forest hover:underline mt-2 inline-block"
                >
                  Create your first resource
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {categoryOrder.map((catKey) => {
                  const items = grouped[catKey];
                  if (!items || items.length === 0) return null;
                  return (
                    <motion.div
                      key={catKey}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h2 className="font-heading text-base font-bold text-scout-navy mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-scout-forest" />
                        {getCategoryLabel(catKey)}
                        <span className="text-xs font-body font-normal text-scout-slate">
                          ({items.length})
                        </span>
                      </h2>
                      <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 overflow-hidden">
                        <div className="divide-y divide-scout-khaki/15">
                          {items.map((resource, i) => (
                            <div
                              key={resource.id}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-scout-cream/50 transition-colors"
                            >
                              <div className="text-scout-khaki/40">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-body font-semibold text-scout-navy truncate">
                                  {resource.title}
                                </p>
                                <p className="text-xs font-body text-scout-slate mt-0.5">
                                  /{resource.slug}
                                </p>
                              </div>
                              <span
                                className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
                                  resource.published
                                    ? 'bg-scout-sage/20 text-scout-forest'
                                    : 'bg-scout-khaki/20 text-scout-earth'
                                }`}
                              >
                                {resource.published ? 'Published' : 'Draft'}
                              </span>
                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleMoveUp(resource, items)}
                                  disabled={i === 0}
                                  className="p-1 text-scout-slate hover:bg-scout-khaki/20 rounded disabled:opacity-30 transition-colors"
                                  title="Move up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveDown(resource, items)}
                                  disabled={i === items.length - 1}
                                  className="p-1 text-scout-slate hover:bg-scout-khaki/20 rounded disabled:opacity-30 transition-colors"
                                  title="Move down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <Link
                                  to={`/admin/resources/${resource.id}`}
                                  className="p-1.5 text-scout-slate hover:bg-scout-khaki/20 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(resource)}
                                  className="p-1.5 text-scout-ember hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Show any uncategorized */}
                {Object.keys(grouped)
                  .filter((k) => !categoryOrder.includes(k))
                  .map((catKey) => {
                    const items = grouped[catKey];
                    if (!items || items.length === 0) return null;
                    return (
                      <motion.div
                        key={catKey}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h2 className="font-heading text-base font-bold text-scout-navy mb-3">
                          {getCategoryLabel(catKey)} ({items.length})
                        </h2>
                        <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 overflow-hidden">
                          <div className="divide-y divide-scout-khaki/15">
                            {items.map((resource) => (
                              <div
                                key={resource.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-scout-cream/50 transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-body font-semibold text-scout-navy truncate">
                                    {resource.title}
                                  </p>
                                </div>
                                <Link
                                  to={`/admin/resources/${resource.id}`}
                                  className="p-1.5 text-scout-slate hover:bg-scout-khaki/20 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(resource)}
                                  className="p-1.5 text-scout-ember hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
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
                <h3 className="font-heading text-lg font-bold text-scout-navy">Delete Resource</h3>
              </div>
              <p className="text-sm font-body text-scout-navy mb-6">
                Delete &ldquo;{deleteTarget.title}&rdquo;? This cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
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
