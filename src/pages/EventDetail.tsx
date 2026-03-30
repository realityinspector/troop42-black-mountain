import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO, isSameDay, differenceInDays } from 'date-fns';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarPlus,
  Pencil,
  ChevronRight,
} from 'lucide-react';
import SEO from '@/components/SEO';
import AnimatedSection from '@/components/AnimatedSection';
import { getEvent, getEvents } from '@/lib/api';
import type { Event } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import EventCard, { getEventCategory } from '@/components/EventCard';

const categoryConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  MEETING: { label: 'Meeting', color: 'text-scout-pine', bg: 'bg-scout-pine/10' },
  CAMPOUT: { label: 'Campout', color: 'text-scout-forest', bg: 'bg-scout-forest/10' },
  SERVICE: { label: 'Service', color: 'text-scout-sage', bg: 'bg-scout-sage/20' },
  FUNDRAISER: { label: 'Fundraiser', color: 'text-scout-amber', bg: 'bg-amber-50' },
  SPECIAL: {
    label: 'Special Event',
    color: 'text-scout-campfire',
    bg: 'bg-orange-50',
  },
};

function generateICS(event: Event): string {
  const formatICSDate = (dateStr: string): string => {
    const d = parseISO(dateStr);
    return format(d, "yyyyMMdd'T'HHmmss");
  };

  const start = formatICSDate(event.startDate);
  const end = event.endDate ? formatICSDate(event.endDate) : start;
  const now = format(new Date(), "yyyyMMdd'T'HHmmss");
  const description = (event.description || event.content || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\n/g, '\\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Troop 42 Black Mountain//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@troop42blackmountain`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${description}`,
    event.location ? `LOCATION:${event.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}

function downloadICS(event: Event) {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const eventData = await getEvent(slug);
        setEvent(eventData);

        // Fetch related events (same derived category)
        try {
          const eventCategory = getEventCategory(eventData);
          const allEvents = await getEvents();
          const related = allEvents
            .filter(
              (e) =>
                getEventCategory(e) === eventCategory &&
                e.id !== eventData.id
            )
            .slice(0, 3);
          setRelatedEvents(related);
        } catch {
          // Related events are non-critical
        }
      } catch (err) {
        setError('Event not found.');
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-scout-mist border-t-scout-forest" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container-narrow py-20 text-center">
        <p className="font-heading text-2xl text-scout-slate/60 mb-4">
          {error || 'Event not found'}
        </p>
        <Link to="/events" className="btn-outline text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Back to Events
        </Link>
      </div>
    );
  }

  const start = parseISO(event.startDate);
  const end = event.endDate ? parseISO(event.endDate) : null;
  const eventCategory = getEventCategory(event);
  const cat = categoryConfig[eventCategory] || categoryConfig.MEETING;
  const sameDay = end ? isSameDay(start, end) : true;
  const multiDay = end ? differenceInDays(end, start) >= 1 : false;

  const dateDisplay = end
    ? sameDay
      ? format(start, 'EEEE, MMMM d, yyyy')
      : `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    : format(start, 'EEEE, MMMM d, yyyy');

  const timeDisplay = end
    ? `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
    : format(start, 'h:mm a');

  const htmlContent = event.description || event.content || '';
  const plainDescription = htmlContent.replace(/<[^>]*>/g, '').slice(0, 155);

  return (
    <>
      <SEO title={event.title} description={plainDescription} />

      {/* Breadcrumb */}
      <div className="bg-scout-cream border-b border-scout-khaki/20">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-2 text-sm font-body text-scout-slate/70">
            <Link
              to="/events"
              className="hover:text-scout-forest transition-colors"
            >
              Events
            </Link>
            <ChevronRight size={14} />
            <span className="text-scout-navy font-medium truncate">
              {event.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="container-wide py-10 sm:py-14">
        <div className="max-w-4xl">
          <AnimatedSection direction="up">
            {/* Back Link */}
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-sm text-scout-slate/70 hover:text-scout-forest transition-colors font-body mb-6"
            >
              <ArrowLeft size={14} />
              Back to Events
            </Link>

            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-body font-semibold px-3 py-1 rounded-full ${cat.bg} ${cat.color}`}
              >
                {cat.label}
              </span>
              {isAdmin && (
                <Link
                  to={`/admin/events/${event.id}/edit`}
                  className="inline-flex items-center gap-1.5 text-xs text-scout-slate/60 hover:text-scout-forest transition-colors"
                >
                  <Pencil size={12} />
                  Edit Event
                </Link>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-scout-navy leading-tight">
              {event.title}
            </h1>

            {/* Date, Time, Location */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 text-scout-slate">
                <Clock size={18} className="text-scout-pine flex-shrink-0" />
                <div className="font-body">
                  <p className="font-medium">{dateDisplay}</p>
                  <p className="text-sm text-scout-slate/70">{timeDisplay}</p>
                  {multiDay && end && (
                    <p className="text-xs text-scout-slate/50 mt-0.5">
                      {differenceInDays(end, start) + 1} days
                    </p>
                  )}
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-scout-slate">
                  <MapPin size={18} className="text-scout-pine flex-shrink-0" />
                  <span className="font-body">{event.location}</span>
                </div>
              )}
            </div>

            {/* Add to Calendar */}
            <div className="mt-6">
              <button
                onClick={() => downloadICS(event)}
                className="btn-outline text-sm gap-2"
              >
                <CalendarPlus size={16} />
                Add to Calendar
              </button>
            </div>
          </AnimatedSection>

          {/* Event Image */}
          {event.imageUrl && (
            <AnimatedSection direction="up" delay={0.1}>
              <div className="mt-8 rounded-xl overflow-hidden shadow-md">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-auto max-h-[480px] object-cover"
                />
              </div>
            </AnimatedSection>
          )}

          {/* Description */}
          {htmlContent && (
            <AnimatedSection direction="up" delay={0.15}>
              <div className="mt-10 border-t border-scout-khaki/20 pt-8">
                <div
                  className="prose prose-lg max-w-none font-body
                    prose-headings:font-heading prose-headings:text-scout-navy
                    prose-p:text-scout-slate prose-p:leading-relaxed
                    prose-a:text-scout-pine prose-a:underline-offset-2 hover:prose-a:text-scout-forest
                    prose-strong:text-scout-navy
                    prose-ul:text-scout-slate prose-ol:text-scout-slate
                    prose-li:marker:text-scout-sage"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </AnimatedSection>
          )}
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <AnimatedSection direction="up" delay={0.25}>
            <div className="mt-16 border-t border-scout-khaki/20 pt-10">
              <h2 className="section-heading text-2xl mb-6">
                More {cat.label} Events
              </h2>
              <div className="space-y-4">
                {relatedEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}
      </article>
    </>
  );
}
