import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle, Info, Bell } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { getNotifications, type Notification } from '@/lib/api';

const notificationIcons: Record<Notification['type'], typeof Info> = {
  INFO: Info,
  WARNING: AlertTriangle,
  URGENT: AlertTriangle,
};

const notificationStyles: Record<Notification['type'], string> = {
  INFO: 'bg-scout-sky/10 border-scout-sky text-scout-navy',
  WARNING: 'bg-scout-amber/10 border-scout-amber text-scout-navy',
  URGENT: 'bg-scout-ember/10 border-scout-ember text-scout-ember',
};

export default function Layout() {
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem('dismissed_notifications');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Fetch active notifications
  useEffect(() => {
    getNotifications({ active: true })
      .then(setNotifications)
      .catch(() => {
        // Silently fail - notifications are not critical
      });
  }, []);

  const dismissNotification = (id: string) => {
    const updated = new Set(dismissed);
    updated.add(id);
    setDismissed(updated);
    sessionStorage.setItem('dismissed_notifications', JSON.stringify([...updated]));
  };

  const visibleNotifications = notifications.filter((n) => !dismissed.has(n.id));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Notification Banners */}
      <AnimatePresence>
        {visibleNotifications.length > 0 && (
          <div className="relative z-40">
            {visibleNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || Bell;
              const styles = notificationStyles[notification.type] || notificationStyles['INFO'];

              return (
                <motion.div
                  key={notification.id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`border-b-2 ${styles}`}
                >
                  <div className="container-wide py-3 flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {notification.title && (
                        <span className="font-body font-semibold text-sm mr-2">
                          {notification.title}:
                        </span>
                      )}
                      <span className="font-body text-sm">{notification.message}</span>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
