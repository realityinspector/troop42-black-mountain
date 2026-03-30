import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Fundraising from '@/pages/Fundraising';

// Lazy-loaded pages
const Events = lazy(() => import('@/pages/Events'));
const EventDetail = lazy(() => import('@/pages/EventDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Resources = lazy(() => import('@/pages/Resources'));
const Login = lazy(() => import('@/pages/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const EditPost = lazy(() => import('@/pages/admin/EditPost'));
const EditEvent = lazy(() => import('@/pages/admin/EditEvent'));
const ManageNotifications = lazy(() => import('@/pages/admin/ManageNotifications'));
const ManageResources = lazy(() => import('@/pages/admin/ManageResources'));
const EditResource = lazy(() => import('@/pages/admin/EditResource'));
const AdminMessages = lazy(() => import('@/pages/admin/AdminMessages'));

// Loading spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-scout-sage border-t-scout-forest rounded-full animate-spin" />
        <p className="font-body text-sm text-scout-slate">Loading...</p>
      </div>
    </div>
  );
}

// Auth guard for admin routes
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// 404 page
function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-4">
        <p className="font-heading text-8xl font-bold text-scout-sage/30 mb-4">404</p>
        <h1 className="font-heading text-3xl font-bold text-scout-navy mb-2">
          Trail Not Found
        </h1>
        <p className="font-body text-scout-slate mb-6">
          Looks like you've wandered off the trail. Let's get you back to camp.
        </p>
        <a href="/" className="btn-primary">
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1B263B',
            color: '#FDF6E3',
            fontFamily: '"Source Sans 3", system-ui, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#52B788',
              secondary: '#FDF6E3',
            },
          },
          error: {
            iconTheme: {
              primary: '#B33A1F',
              secondary: '#FDF6E3',
            },
          },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route
            path="events"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Events />
              </Suspense>
            }
          />
          <Route
            path="events/:slug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <EventDetail />
              </Suspense>
            }
          />
          <Route
            path="blog"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Blog />
              </Suspense>
            }
          />
          <Route
            path="blog/:slug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BlogPost />
              </Suspense>
            }
          />
          <Route
            path="resources"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Resources />
              </Suspense>
            }
          />
          <Route path="fundraising" element={<Fundraising />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route
            path="login"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Login />
              </Suspense>
            }
          />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="admin/posts/new"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <EditPost />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="admin/posts/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <EditPost />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="admin/events/new"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <EditEvent />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="admin/events/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <EditEvent />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="admin/notifications"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <ManageNotifications />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="admin/resources"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <ManageResources />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="admin/resources/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <EditResource />
                </RequireAuth>
              </Suspense>
            }
          />
          <Route
            path="admin/messages"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RequireAuth>
                  <AdminMessages />
                </RequireAuth>
              </Suspense>
            }
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
