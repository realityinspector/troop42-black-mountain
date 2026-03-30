import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Mail,
  MailOpen,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  Clock,
  User,
  Inbox,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/SEO';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getContactMessages, markContactRead } from '@/lib/api';
import type { ContactMessage } from '@/lib/api';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminMessages() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      // Sort newest first
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMessages(data);
    } catch {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMarkRead = async (msg: ContactMessage) => {
    if (msg.read) return;
    setMarkingRead(msg.id);
    try {
      await markContactRead(msg.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
      );
      toast.success('Marked as read.');
    } catch {
      toast.error('Failed to mark as read.');
    } finally {
      setMarkingRead(null);
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

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <SEO title="Messages" />
      <div className="min-h-screen bg-scout-cream">
        <AdminSidebar unreadMessages={unreadCount} />
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
                  <MessageSquare className="w-6 h-6 text-scout-gold" />
                  Messages
                  {unreadCount > 0 && (
                    <span className="bg-scout-campfire text-white text-xs font-body font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </h1>
                <p className="text-sm font-body text-scout-slate mt-1">
                  Contact form submissions from your site visitors.
                </p>
              </div>
            </motion.div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-scout-forest" />
              </div>
            ) : messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Inbox className="w-12 h-12 text-scout-khaki/50 mx-auto mb-3" />
                <p className="font-heading text-lg font-bold text-scout-navy">No messages yet</p>
                <p className="font-body text-sm text-scout-slate mt-1">
                  When visitors submit the contact form, their messages will appear here.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, i) => {
                  const isExpanded = expandedId === msg.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-colors ${
                        msg.read
                          ? 'border-scout-khaki/15'
                          : 'border-scout-gold/40 bg-scout-gold/[0.02]'
                      }`}
                    >
                      {/* Message Row */}
                      <button
                        type="button"
                        onClick={() => handleToggleExpand(msg.id)}
                        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-scout-cream/50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {msg.read ? (
                            <MailOpen className="w-5 h-5 text-scout-khaki" />
                          ) : (
                            <Mail className="w-5 h-5 text-scout-gold" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm font-body truncate ${
                                msg.read
                                  ? 'text-scout-navy'
                                  : 'text-scout-navy font-semibold'
                              }`}
                            >
                              {msg.subject}
                            </p>
                            <span className="text-xs font-body text-scout-slate whitespace-nowrap flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-body text-scout-slate flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {msg.name}
                            </span>
                            <span className="text-xs font-body text-scout-sky">&middot;</span>
                            <span className="text-xs font-body text-scout-slate truncate">
                              {msg.email}
                            </span>
                          </div>
                          {!isExpanded && (
                            <p className="text-xs font-body text-scout-slate mt-1 truncate">
                              {msg.message}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 mt-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-scout-slate" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-scout-slate" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 border-t border-scout-khaki/15">
                              {/* Message Body */}
                              <div className="mt-4 p-4 bg-scout-parchment rounded-lg">
                                <p className="text-sm font-body text-scout-navy whitespace-pre-wrap leading-relaxed">
                                  {msg.message}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3">
                                  <a
                                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-scout-forest text-white text-xs font-body font-semibold rounded-lg hover:bg-scout-pine transition-colors"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    Reply via Email
                                  </a>
                                  {!msg.read && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkRead(msg);
                                      }}
                                      disabled={markingRead === msg.id}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-scout-khaki/40 text-scout-navy text-xs font-body font-semibold rounded-lg hover:bg-scout-khaki/10 transition-colors disabled:opacity-50"
                                    >
                                      {markingRead === msg.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <CheckCheck className="w-3.5 h-3.5" />
                                      )}
                                      Mark as Read
                                    </button>
                                  )}
                                </div>
                                <div className="text-xs font-body text-scout-slate">
                                  {new Date(msg.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
