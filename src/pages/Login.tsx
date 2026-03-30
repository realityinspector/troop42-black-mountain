import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Key, LogIn, Chrome, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/SEO';
import { useAuth } from '@/hooks/useAuth';
import LogoMark from '@/assets/brand/logo-mark.svg';

type AuthTab = 'credentials' | 'devtoken';

export default function Login() {
  const navigate = useNavigate();
  const { user, isLoading, login, loginWithDevToken } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [devToken, setDevToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleTooltip, setGoogleTooltip] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/admin', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleCredentialLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    if (!password) {
      toast.error('Please enter your password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevTokenLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!devToken.trim()) {
      toast.error('Please enter a development token.');
      return;
    }
    setSubmitting(true);
    try {
      await loginWithDevToken(devToken.trim());
      toast.success('Authenticated with dev token.');
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid token. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center topo-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-4 border-scout-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <SEO title="Sign In" description="Sign in to the Troop 42 Black Mountain admin dashboard." />

      <div className="min-h-screen flex items-center justify-center topo-bg px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-scout-parchment rounded-2xl shadow-2xl overflow-hidden border border-scout-khaki/30">
            {/* Header */}
            <div className="bg-scout-navy px-8 py-8 text-center">
              <img
                src={LogoMark}
                alt="Troop 42 Black Mountain"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h1 className="font-heading text-2xl font-bold text-scout-cream">
                Troop 42 Admin
              </h1>
              <p className="text-scout-sky text-sm mt-1 font-body">
                Sign in to manage your troop site
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-scout-khaki/30">
              <button
                type="button"
                onClick={() => setActiveTab('credentials')}
                className={`flex-1 py-3 text-sm font-body font-semibold transition-colors ${
                  activeTab === 'credentials'
                    ? 'text-scout-forest border-b-2 border-scout-gold bg-white/50'
                    : 'text-scout-slate hover:text-scout-forest'
                }`}
              >
                <Mail className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
                Email / Password
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('devtoken')}
                className={`flex-1 py-3 text-sm font-body font-semibold transition-colors ${
                  activeTab === 'devtoken'
                    ? 'text-scout-forest border-b-2 border-scout-gold bg-white/50'
                    : 'text-scout-slate hover:text-scout-forest'
                }`}
              >
                <Key className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
                Dev Token
              </button>
            </div>

            {/* Form Area */}
            <div className="px-8 py-8">
              <AnimatePresence mode="wait">
                {activeTab === 'credentials' ? (
                  <motion.form
                    key="credentials"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleCredentialLogin}
                    className="space-y-5"
                  >
                    <div>
                      <label htmlFor="email" className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scout-slate" />
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="scoutmaster@troop42.org"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scout-slate" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-scout-slate hover:text-scout-navy transition"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="devtoken"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleDevTokenLogin}
                    className="space-y-5"
                  >
                    <div>
                      <label htmlFor="devtoken" className="block text-sm font-body font-semibold text-scout-navy mb-1.5">
                        Development Token
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scout-slate" />
                        <input
                          id="devtoken"
                          type="text"
                          value={devToken}
                          onChange={(e) => setDevToken(e.target.value)}
                          placeholder="Paste your dev token here"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-navy font-body font-mono text-sm placeholder:text-scout-sky/60 placeholder:font-body focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition"
                        />
                      </div>
                      <p className="text-xs text-scout-slate mt-1.5">
                        For development and testing purposes only.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Key className="w-4 h-4 mr-2" />
                          Authenticate
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-scout-khaki/40" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-scout-parchment px-3 text-scout-slate font-body">or</span>
                </div>
              </div>

              {/* Google Sign-in (disabled) */}
              <div className="relative">
                <button
                  type="button"
                  disabled
                  onMouseEnter={() => setGoogleTooltip(true)}
                  onMouseLeave={() => setGoogleTooltip(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-scout-khaki/50 rounded-lg text-scout-slate font-body font-semibold text-sm opacity-60 cursor-not-allowed transition"
                >
                  <Chrome className="w-4 h-4" />
                  Sign in with Google
                </button>
                <AnimatePresence>
                  {googleTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-scout-navy text-white text-xs font-body px-3 py-1 rounded shadow-lg whitespace-nowrap"
                    >
                      Coming Soon
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-scout-mist/70 text-xs font-body mt-6">
            Troop 42 Black Mountain &middot; Scouts BSA
          </p>
        </motion.div>
      </div>
    </>
  );
}
