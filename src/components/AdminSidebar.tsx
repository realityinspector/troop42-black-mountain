import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
  Bell,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LogoMark from '@/assets/brand/logo-mark.svg';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface AdminSidebarProps {
  unreadMessages?: number;
}

export default function AdminSidebar({ unreadMessages = 0 }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Posts', path: '/admin/posts', icon: FileText },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Resources', path: '/admin/resources', icon: BookOpen },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare, badge: unreadMessages },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/10">
        <img src={LogoMark} alt="Troop 42" className="w-10 h-10" />
        <div>
          <p className="font-heading text-sm font-bold text-scout-cream leading-tight">Troop 42</p>
          <p className="text-[10px] text-scout-sky font-body">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-colors relative ${
                active
                  ? 'bg-scout-forest text-scout-cream'
                  : 'text-scout-sky hover:bg-white/5 hover:text-scout-cream'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-scout-forest rounded-lg"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${active ? 'text-scout-gold' : ''}`} />
              <span className="relative z-10">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="relative z-10 ml-auto bg-scout-campfire text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div className="px-3 pb-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-scout-sky hover:bg-white/5 hover:text-scout-cream transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
      </div>

      {/* User info + Logout */}
      <div className="px-3 pb-4 pt-2 border-t border-white/10 mt-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-scout-forest flex items-center justify-center text-scout-gold font-heading font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold text-scout-cream truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-[11px] font-body text-scout-sky truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-scout-sky hover:bg-white/10 hover:text-scout-cream transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-scout-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LogoMark} alt="Troop 42" className="w-8 h-8" />
          <span className="font-heading text-sm font-bold text-scout-cream">Troop 42 Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-scout-sky hover:bg-white/10 hover:text-scout-cream transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-scout-navy"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-scout-navy z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
