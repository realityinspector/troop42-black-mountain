import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Plus,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/SEO';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getPosts, getEvents, getContactMessages, getNotifications } from '@/lib/api';
import type { Post, Event, ContactMessage, Notification } from '@/lib/api';

interface Stats {
  totalPosts: number;
  totalEvents: number;
  unreadMessages: number;
  activeNotifications: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalEvents: 0,
    unreadMessages: 0,
    activeNotifications: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const [posts, events, messages, notifications] = await Promise.all([
          getPosts().catch(() => [] as Post[]),
          getEvents().catch(() => [] as Event[]),
          getContactMessages().catch(() => [] as ContactMessage[]),
          getNotifications().catch(() => [] as Notification[]),
        ]);

        setStats({
          totalPosts: posts.length,
          totalEvents: events.length,
          unreadMessages: messages.filter((m) => !m.read).length,
          activeNotifications: notifications.filter((n) => n.active).length,
        });
        setRecentPosts(posts.slice(0, 5));
        setRecentEvents(events.slice(0, 5));
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-scout-cream">
        <Loader2 className="w-8 h-8 animate-spin text-scout-forest" />
      </div>
    );
  }

  if (!user) return null;

  const statCards = [
    {
      label: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-scout-forest',
      iconColor: 'text-scout-meadow',
      link: '/admin/posts',
    },
    {
      label: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-scout-navy',
      iconColor: 'text-scout-sky',
      link: '/admin/events',
    },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'bg-scout-campfire',
      iconColor: 'text-orange-200',
      link: '/admin/messages',
    },
    {
      label: 'Active Notifications',
      value: stats.activeNotifications,
      icon: Bell,
      color: 'bg-scout-gold',
      iconColor: 'text-yellow-100',
      link: '/admin/notifications',
    },
  ];

  const quickActions = [
    { label: 'New Post', path: '/admin/posts/new', icon: FileText },
    { label: 'New Event', path: '/admin/events/new', icon: Calendar },
    { label: 'New Resource', path: '/admin/resources/new', icon: Plus },
  ];

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div className="min-h-screen bg-scout-cream">
        <AdminSidebar unreadMessages={stats.unreadMessages} />

        {/* Main content */}
        <main className="lg:pl-64 pt-16 lg:pt-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="font-heading text-3xl font-bold text-scout-navy">
                Welcome back, {user.name?.split(' ')[0] || 'Scout Leader'}
              </h1>
              <p className="font-body text-scout-slate mt-1">
                Here is an overview of your troop site.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={card.link}
                      className="block p-5 bg-white rounded-xl shadow-sm hover:shadow-md border border-scout-khaki/20 transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-body text-scout-slate">{card.label}</p>
                          <p className="text-3xl font-heading font-bold text-scout-navy mt-1">
                            {loading ? (
                              <span className="inline-block w-8 h-8 bg-scout-khaki/30 rounded animate-pulse" />
                            ) : (
                              card.value
                            )}
                          </p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${card.iconColor}`} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="font-heading text-lg font-bold text-scout-navy mb-3">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.path}
                      to={action.path}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-scout-forest text-white font-body font-semibold text-sm rounded-lg hover:bg-scout-pine transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Posts */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-scout-khaki/20 flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-scout-navy flex items-center gap-2">
                    <FileText className="w-4 h-4 text-scout-forest" />
                    Recent Posts
                  </h3>
                  <Link
                    to="/admin/posts"
                    className="text-xs font-body font-semibold text-scout-forest hover:text-scout-pine"
                  >
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-scout-khaki/15">
                  {loading ? (
                    <div className="p-5 text-center">
                      <Loader2 className="w-5 h-5 animate-spin text-scout-slate mx-auto" />
                    </div>
                  ) : recentPosts.length === 0 ? (
                    <div className="p-5 text-center">
                      <p className="text-sm font-body text-scout-slate">No posts yet.</p>
                      <Link
                        to="/admin/posts/new"
                        className="text-sm font-body font-semibold text-scout-forest hover:underline mt-1 inline-block"
                      >
                        Create your first post
                      </Link>
                    </div>
                  ) : (
                    recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/admin/posts/${post.id}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-scout-cream/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-body font-semibold text-scout-navy truncate">
                            {post.title}
                          </p>
                          <p className="text-xs font-body text-scout-slate mt-0.5">
                            {post.category || 'Blog'} &middot;{' '}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
                            post.published
                              ? 'bg-scout-sage/20 text-scout-forest'
                              : 'bg-scout-khaki/20 text-scout-earth'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recent Events */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-scout-khaki/20 flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-scout-navy flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-scout-forest" />
                    Recent Events
                  </h3>
                  <Link
                    to="/admin/events"
                    className="text-xs font-body font-semibold text-scout-forest hover:text-scout-pine"
                  >
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-scout-khaki/15">
                  {loading ? (
                    <div className="p-5 text-center">
                      <Loader2 className="w-5 h-5 animate-spin text-scout-slate mx-auto" />
                    </div>
                  ) : recentEvents.length === 0 ? (
                    <div className="p-5 text-center">
                      <p className="text-sm font-body text-scout-slate">No events yet.</p>
                      <Link
                        to="/admin/events/new"
                        className="text-sm font-body font-semibold text-scout-forest hover:underline mt-1 inline-block"
                      >
                        Create your first event
                      </Link>
                    </div>
                  ) : (
                    recentEvents.map((evt) => (
                      <Link
                        key={evt.id}
                        to={`/admin/events/${evt.id}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-scout-cream/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-body font-semibold text-scout-navy truncate">
                            {evt.title}
                          </p>
                          <p className="text-xs font-body text-scout-slate mt-0.5">
                            {evt.location || 'TBD'} &middot;{' '}
                            {new Date(evt.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
                            evt.published
                              ? 'bg-scout-sage/20 text-scout-forest'
                              : 'bg-scout-khaki/20 text-scout-earth'
                          }`}
                        >
                          {evt.published ? 'Published' : 'Draft'}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
