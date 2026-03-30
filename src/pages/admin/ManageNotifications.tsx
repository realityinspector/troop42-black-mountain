import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  Info,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/SEO';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from '@/lib/api';
import type { Notification } from '@/lib/api';

const NOTIFICATION_TYPES: { value: Notification['type']; label: string; color: string; icon: typeof Info }[] = [
  { value: 'INFO', label: 'Info', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Info },
  { value: 'WARNING', label: 'Warning', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
];

function getTypeStyle(type: string) {
  return NOTIFICATION_TYPES.find((t) => t.value === type) || NOTIFICATION_TYPES[0];
}

interface NotificationForm {
  title: string;
  message: string;
  type: Notification['type'];
  active: boolean;
  expiresAt: string;
}

const emptyForm: NotificationForm = {
  title: '',
  message: '',
  type: 'INFO',
  active: true,
  expiresAt: '',
};

export default function ManageNotifications() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NotificationForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      toast.error('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const handleOpenCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (notif: Notification) => {
    setForm({
      title: notif.title,
      message: notif.message,
      type: notif.type,
      active: notif.active,
      expiresAt: notif.expiresAt ? notif.expiresAt.split('T')[0] : '',
    });
    setEditingId(notif.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (!form.message.trim()) {
      toast.error('Message is required.');
      return;
    }

    setSaving(true);
    const data: Partial<Notification> = {
      title: form.title.trim(),
      message: form.message.trim(),
      type: form.type,
      active: form.active,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
    };

    try {
      if (editingId) {
        await updateNotification(editingId, data);
        toast.success('Notification updated.');
      } else {
        await createNotification(data);
        toast.success('Notification created.');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchNotifications();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save notification.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNotification(deleteTarget.id);
      toast.success('Notification deleted.');
      setDeleteTarget(null);
      fetchNotifications();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete notification.';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (notif: Notification) => {
    try {
      await updateNotification(notif.id, { active: !notif.active });
      toast.success(notif.active ? 'Notification deactivated.' : 'Notification activated.');
      fetchNotifications();
    } catch {
      toast.error('Failed to update notification.');
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

  const activeNotifs = notifications.filter((n) => n.active);
  const inactiveNotifs = notifications.filter((n) => !n.active);

  return (
    <>
      <SEO title="Manage Notifications" />
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
                  <Bell className="w-6 h-6 text-scout-gold" />
                  Notifications
                </h1>
                <p className="text-sm font-body text-scout-slate mt-1">
                  Manage site-wide notification banners.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Notification
              </button>
            </motion.div>

            {/* Create/Edit Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-heading text-lg font-bold text-scout-navy">
                        {editingId ? 'Edit Notification' : 'Create Notification'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                          setForm(emptyForm);
                        }}
                        className="p-1 text-scout-slate hover:text-scout-navy transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                        Title <span className="text-scout-ember">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Notification title"
                        className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                        Message <span className="text-scout-ember">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={3}
                        placeholder="Notification message..."
                        className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                          Type
                        </label>
                        <select
                          value={form.type}
                          onChange={(e) => setForm({ ...form, type: e.target.value as Notification['type'] })}
                          className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                        >
                          {NOTIFICATION_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                          Expires At
                        </label>
                        <input
                          type="date"
                          value={form.expiresAt}
                          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 py-2.5 cursor-pointer">
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, active: !form.active })}
                            className={`relative w-10 h-6 rounded-full transition-colors ${
                              form.active ? 'bg-scout-forest' : 'bg-scout-khaki/50'
                            }`}
                          >
                            <motion.div
                              animate={{ x: form.active ? 16 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm"
                            />
                          </button>
                          <span className="text-sm font-body font-semibold text-scout-navy">
                            {form.active ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <p className="text-xs font-body font-semibold text-scout-slate mb-1.5">Preview</p>
                      <div className={`px-4 py-3 rounded-lg border ${getTypeStyle(form.type).color}`}>
                        <div className="flex items-start gap-2">
                          {(() => {
                            const Icon = getTypeStyle(form.type).icon;
                            return <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />;
                          })()}
                          <div>
                            <p className="text-sm font-body font-semibold">{form.title || 'Title'}</p>
                            <p className="text-sm font-body mt-0.5">{form.message || 'Message...'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        {editingId ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                          setForm(emptyForm);
                        }}
                        className="px-4 py-2.5 text-sm font-body font-semibold text-scout-slate hover:text-scout-navy transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-scout-forest" />
              </div>
            ) : notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Bell className="w-12 h-12 text-scout-khaki/50 mx-auto mb-3" />
                <p className="font-body text-scout-slate">No notifications yet.</p>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="text-sm font-body font-semibold text-scout-forest hover:underline mt-2"
                >
                  Create your first notification
                </button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Active Notifications */}
                {activeNotifs.length > 0 && (
                  <div>
                    <h2 className="font-heading text-base font-bold text-scout-navy mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-scout-sage" />
                      Active ({activeNotifs.length})
                    </h2>
                    <div className="space-y-2">
                      {activeNotifs.map((notif, i) => {
                        const typeStyle = getTypeStyle(notif.type);
                        const Icon = typeStyle.icon;
                        return (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={`p-1.5 rounded-lg border ${typeStyle.color}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-body font-semibold text-scout-navy">
                                    {notif.title}
                                  </p>
                                  <p className="text-sm font-body text-scout-slate mt-0.5 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full border ${typeStyle.color}`}>
                                      {typeStyle.label}
                                    </span>
                                    {notif.expiresAt && (
                                      <span className="text-[10px] font-body text-scout-slate">
                                        Expires: {new Date(notif.expiresAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleActive(notif)}
                                  title="Deactivate"
                                  className="p-1.5 text-scout-slate hover:bg-scout-khaki/20 rounded-lg transition-colors"
                                >
                                  <Bell className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(notif)}
                                  className="p-1.5 text-scout-slate hover:bg-scout-khaki/20 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(notif)}
                                  className="p-1.5 text-scout-ember hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Inactive Notifications */}
                {inactiveNotifs.length > 0 && (
                  <div>
                    <h2 className="font-heading text-base font-bold text-scout-navy mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-scout-khaki" />
                      Inactive ({inactiveNotifs.length})
                    </h2>
                    <div className="space-y-2">
                      {inactiveNotifs.map((notif, i) => {
                        const typeStyle = getTypeStyle(notif.type);
                        const Icon = typeStyle.icon;
                        return (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/60 rounded-xl shadow-sm border border-scout-khaki/15 p-4 opacity-70"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={`p-1.5 rounded-lg border ${typeStyle.color} opacity-60`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-body font-semibold text-scout-navy">
                                    {notif.title}
                                  </p>
                                  <p className="text-sm font-body text-scout-slate mt-0.5 line-clamp-1">
                                    {notif.message}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleActive(notif)}
                                  title="Activate"
                                  className="p-1.5 text-scout-forest hover:bg-scout-sage/20 rounded-lg transition-colors"
                                >
                                  <Bell className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(notif)}
                                  className="p-1.5 text-scout-slate hover:bg-scout-khaki/20 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(notif)}
                                  className="p-1.5 text-scout-ember hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                <h3 className="font-heading text-lg font-bold text-scout-navy">Delete Notification</h3>
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
