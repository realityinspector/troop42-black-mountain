import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import logoUrl from '@/assets/brand/logo.svg';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/blog', label: 'Blog' },
  { to: '/resources', label: 'Resources' },
  { to: '/fundraising', label: 'Fundraising', badge: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-scout-cream/95 backdrop-blur-md shadow-md'
          : 'bg-scout-cream'
      }`}
    >
      <nav className="container-wide" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2 group"
            aria-label="Troop 42 Black Mountain - Home"
          >
            <img
              src={logoUrl}
              alt="Troop 42 Black Mountain"
              className="h-12 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-body font-semibold tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-scout-forest'
                      : 'text-scout-navy/70 hover:text-scout-forest'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-1.5">
                      {link.label}
                      {link.badge && (
                        <Star className="w-3 h-3 text-scout-gold fill-scout-gold" />
                      )}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="navbar-underline"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-scout-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-body font-semibold tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-scout-campfire'
                      : 'text-scout-campfire/70 hover:text-scout-campfire'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-scout-navy hover:bg-scout-mist transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-scout-navy/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-scout-cream shadow-2xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b border-scout-mist">
                  <img src={logoUrl} alt="Troop 42" className="h-10 w-auto" />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-scout-navy hover:bg-scout-mist transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-6 py-3 text-base font-body font-semibold transition-colors ${
                            isActive
                              ? 'text-scout-forest bg-scout-mist/50 border-r-3 border-scout-gold'
                              : 'text-scout-navy/80 hover:text-scout-forest hover:bg-scout-mist/30'
                          }`
                        }
                      >
                        {link.label}
                        {link.badge && (
                          <Star className="w-3.5 h-3.5 text-scout-gold fill-scout-gold" />
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                  {isAdmin && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * navLinks.length }}
                    >
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-6 py-3 text-base font-body font-semibold transition-colors ${
                            isActive
                              ? 'text-scout-campfire bg-scout-mist/50'
                              : 'text-scout-campfire/80 hover:text-scout-campfire hover:bg-scout-mist/30'
                          }`
                        }
                      >
                        Admin Dashboard
                      </NavLink>
                    </motion.div>
                  )}
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-scout-mist">
                  {user ? (
                    <p className="text-xs text-scout-slate font-body">
                      Signed in as {user.name}
                    </p>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-2 text-sm font-body font-semibold text-scout-forest border border-scout-forest rounded-lg hover:bg-scout-forest hover:text-white transition-colors"
                    >
                      Scout Leader Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
