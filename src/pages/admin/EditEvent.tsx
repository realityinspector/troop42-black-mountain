import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Trash2,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  MapPin,
  CalendarDays,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/SEO';
import AdminSidebar from '@/components/AdminSidebar';
import RichTextEditor from '@/components/RichTextEditor';
import AIContentGenerator from '@/components/AIContentGenerator';
import { useAuth } from '@/hooks/useAuth';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/lib/api';
import type { Event } from '@/lib/api';

const EVENT_CATEGORIES = [
  { value: 'MEETING', label: 'Meeting' },
  { value: 'CAMPOUT', label: 'Campout' },
  { value: 'SERVICE', label: 'Service Project' },
  { value: 'FUNDRAISER', label: 'Fundraiser' },
  { value: 'SPECIAL', label: 'Special Event' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function toDatetimeLocal(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [category, setCategory] = useState<Event['category']>('MEETING');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const existingEvent = useRef<Event | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Load existing event
  useEffect(() => {
    if (isNew || !user) return;

    async function load() {
      try {
        const events = await getEvents();
        const evt = events.find((e) => e.id === id);
        if (!evt) {
          toast.error('Event not found.');
          navigate('/admin/events', { replace: true });
          return;
        }
        existingEvent.current = evt;
        setTitle(evt.title);
        setSlug(evt.slug);
        setSlugManual(true);
        setCategory(evt.category || 'MEETING');
        setLocation(evt.location || '');
        setStartDate(toDatetimeLocal(evt.startDate));
        setEndDate(evt.endDate ? toDatetimeLocal(evt.endDate) : '');
        setAllDay(evt.allDay ?? false);
        setDescription(evt.description || evt.content || '');
        setImageUrl(evt.imageUrl || '');
        setPublished(evt.published);
      } catch {
        toast.error('Failed to load event.');
        navigate('/admin/events', { replace: true });
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
    if (!startDate) {
      toast.error('Start date is required.');
      return;
    }

    setSaving(true);
    const data: Partial<Event> = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      category,
      location: location.trim() || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      allDay,
      description,
      imageUrl: imageUrl.trim() || undefined,
      published: shouldPublish !== undefined ? shouldPublish : published,
    };

    try {
      if (isNew) {
        const created = await createEvent(data);
        toast.success('Event created!');
        navigate(`/admin/events/${created.id}`, { replace: true });
      } else {
        await updateEvent(existingEvent.current!.id, data);
        if (shouldPublish !== undefined) setPublished(shouldPublish);
        toast.success('Event saved!');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save event.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingEvent.current) return;
    setDeleting(true);
    try {
      await deleteEvent(existingEvent.current.id);
      toast.success('Event deleted.');
      navigate('/admin/events', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete event.';
      toast.error(message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleAIInsert = (html: string) => {
    setDescription((prev) => prev + html);
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
      <SEO title={isNew ? 'New Event' : `Edit: ${title}`} />
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
                  to="/admin/events"
                  className="p-2 rounded-lg hover:bg-scout-khaki/20 text-scout-slate transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="font-heading text-2xl font-bold text-scout-navy">
                  {isNew ? 'New Event' : 'Edit Event'}
                </h1>
              </div>

              {!isNew && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-scout-ember hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete event"
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
                  placeholder="Enter event title"
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
                    placeholder="event-url-slug"
                    className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-mono text-sm placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Event['category'])}
                    className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                  <MapPin className="inline w-4 h-4 mr-1 -mt-0.5" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Black Mountain Community Center"
                  className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                />
              </div>

              {/* Date/Time */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-body font-semibold text-scout-navy">
                    <CalendarDays className="inline w-4 h-4 mr-1 -mt-0.5" />
                    Date &amp; Time
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-body text-scout-slate">All Day</span>
                    <button
                      type="button"
                      onClick={() => setAllDay(!allDay)}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        allDay ? 'bg-scout-forest' : 'bg-scout-khaki/50'
                      }`}
                    >
                      <motion.div
                        animate={{ x: allDay ? 16 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body text-scout-slate mb-1">
                      Start {allDay ? 'Date' : 'Date/Time'} <span className="text-scout-ember">*</span>
                    </label>
                    <input
                      type={allDay ? 'date' : 'datetime-local'}
                      value={allDay ? startDate.split('T')[0] : startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-scout-slate mb-1">
                      End {allDay ? 'Date' : 'Date/Time'}
                    </label>
                    <input
                      type={allDay ? 'date' : 'datetime-local'}
                      value={allDay ? endDate.split('T')[0] : endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image */}
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

              {/* AI Generator */}
              <AIContentGenerator onInsert={handleAIInsert} type="event_description" />

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                  Description
                </label>
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Describe this event..."
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-scout-khaki/30">
                <div>
                  <p className="text-sm font-body font-semibold text-scout-navy">Published</p>
                  <p className="text-xs font-body text-scout-slate mt-0.5">
                    {published ? 'This event is visible on the site.' : 'This event is saved as a draft.'}
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
                  {isNew ? 'Create Event' : 'Save Changes'}
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
                  to="/admin/events"
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
                  <h3 className="font-heading text-lg font-bold text-scout-navy">Delete Event</h3>
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
