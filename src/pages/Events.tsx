import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { parseISO, isPast } from 'date-fns';
import { CalendarDays, List, ChevronDown, Plus } from 'lucide-react';
import SEO from '@/components/SEO';
import AnimatedSection from '@/components/AnimatedSection';
import { CompassIcon, TentIcon } from '@/assets/brand/icons';
import { getEvents } from '@/lib/api';
import type { Event } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import EventCard, { getEventCategory, type EventCategory } from '@/components/EventCard';
import CalendarView from '@/components/CalendarView';

type CategoryFilter = 'ALL' | EventCategory;

const filterTabs: { value: CategoryFilter; label: string }[] = [
  { value: 'ALL', label: 'All Events' },
  { value: 'MEETING', label: 'Meetings' },
  { value: 'CAMPOUT', label: 'Campouts' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'FUNDRAISER', label: 'Fundraisers' },
  { value: 'SPECIAL', label: 'Special' },
];

export default function Events() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>(
    (searchParams.get('view') as 'calendar' | 'list') || 'calendar'
  );
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(
    (searchParams.get('category') as CategoryFilter) || 'ALL'
  );
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Unable to load events. Please try again later.');
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Update URL search params when view/filter changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (viewMode !== 'calendar') params.view = viewMode;
    if (categoryFilter !== 'ALL') params.category = categoryFilter;
    setSearchParams(params, { replace: true });
  }, [viewMode, categoryFilter, setSearchParams]);

  const filteredEvents = useMemo(() => {
    if (categoryFilter === 'ALL') return events;
    return events.filter((e) => getEventCategory(e) === categoryFilter);
  }, [events, categoryFilter]);

  const upcomingEvents = useMemo(
    () =>
      filteredEvents
        .filter((e) => {
          const endDate = e.endDate || e.startDate;
          return !isPast(parseISO(endDate));
        })
        .sort(
          (a, b) =>
            parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
        ),
    [filteredEvents]
  );

  const pastEvents = useMemo(
    () =>
      filteredEvents
        .filter((e) => {
          const endDate = e.endDate || e.startDate;
          return isPast(parseISO(endDate));
        })
        .sort(
          (a, b) =>
            parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime()
        ),
    [filteredEvents]
  );

  return (
    <>
      <SEO
        title="Events & Calendar"
        description="Stay up to date with Troop 42 meetings, campouts, service projects, and special events."
      />

      {/* Hero Banner */}
      <section className="topo-bg py-16 sm:py-20 relative overflow-hidden">
        <div className="container-wide relative z-10">
          <AnimatedSection direction="up">
            <div className="flex items-center justify-center gap-4 mb-4">
              <CompassIcon className="w-10 h-10 sm:w-12 sm:h-12 text-scout-gold animate-compass-spin" />
            </div>
            <h1 className="text-center font-heading text-4xl sm:text-5xl font-bold text-white">
              Events & Calendar
            </h1>
            <p className="text-center text-scout-meadow/80 font-body mt-3 text-lg max-w-xl mx-auto">
              Adventures on the horizon. Find upcoming meetings, campouts, service
              projects, and more.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-wide py-10 sm:py-14">
        {/* Controls Bar */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-scout-mist/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-scout-forest shadow-sm'
                    : 'text-scout-slate hover:text-scout-navy'
                }`}
              >
                <CalendarDays size={16} />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-scout-forest shadow-sm'
                    : 'text-scout-slate hover:text-scout-navy'
                }`}
              >
                <List size={16} />
                List
              </button>
            </div>

            {/* Admin Add Button */}
            {isAdmin && (
              <Link to="/admin/events/new" className="btn-primary text-sm gap-2">
                <Plus size={16} />
                Add Event
              </Link>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setCategoryFilter(tab.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                  categoryFilter === tab.value
                    ? 'bg-scout-forest text-white'
                    : 'bg-scout-mist/50 text-scout-slate hover:bg-scout-mist hover:text-scout-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-scout-mist border-t-scout-forest" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-scout-campfire font-body text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline mt-4 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <AnimatedSection direction="up" delay={0.2}>
            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <div className="bg-white rounded-xl shadow-md border border-scout-khaki/15 p-4 sm:p-6">
                <CalendarView events={filteredEvents} />
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <>
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-20">
                    <TentIcon className="w-16 h-16 mx-auto text-scout-khaki/40 mb-4" />
                    <p className="font-heading text-xl text-scout-slate/60">
                      No upcoming events.
                    </p>
                    <p className="font-body text-scout-slate/40 mt-1">
                      Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.35 }}
                      >
                        <EventCard
                          event={event}
                          category={getEventCategory(event)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Past Events Collapsible */}
                {pastEvents.length > 0 && (
                  <div className="mt-12">
                    <button
                      onClick={() => setShowPastEvents(!showPastEvents)}
                      className="flex items-center gap-2 text-scout-slate/70 hover:text-scout-navy transition-colors font-body font-medium group"
                    >
                      <motion.span
                        animate={{ rotate: showPastEvents ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                      Past Events ({pastEvents.length})
                    </button>

                    <AnimatePresence>
                      {showPastEvents && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 mt-4 opacity-75">
                            {pastEvents.map((event) => (
                              <EventCard
                                key={event.id}
                                event={event}
                                category={getEventCategory(event)}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </AnimatedSection>
        )}
      </section>
    </>
  );
}
