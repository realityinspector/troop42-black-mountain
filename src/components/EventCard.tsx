import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { MapPin, Clock } from 'lucide-react';
import type { Event } from '@/lib/api';

type EventCategory = 'MEETING' | 'CAMPOUT' | 'SERVICE' | 'FUNDRAISER' | 'SPECIAL';

const categoryConfig: Record<
  EventCategory,
  { label: string; color: string; bg: string; border: string }
> = {
  MEETING: {
    label: 'Meeting',
    color: 'text-scout-pine',
    bg: 'bg-scout-pine/10',
    border: 'border-scout-pine/30',
  },
  CAMPOUT: {
    label: 'Campout',
    color: 'text-scout-forest',
    bg: 'bg-scout-forest/10',
    border: 'border-scout-forest/30',
  },
  SERVICE: {
    label: 'Service',
    color: 'text-scout-sage',
    bg: 'bg-scout-sage/20',
    border: 'border-scout-sage/40',
  },
  FUNDRAISER: {
    label: 'Fundraiser',
    color: 'text-scout-amber',
    bg: 'bg-amber-50',
    border: 'border-scout-amber/30',
  },
  SPECIAL: {
    label: 'Special Event',
    color: 'text-scout-campfire',
    bg: 'bg-orange-50',
    border: 'border-scout-campfire/30',
  },
};

const categoryAccent: Record<EventCategory, string> = {
  MEETING: 'bg-scout-pine',
  CAMPOUT: 'bg-scout-forest',
  SERVICE: 'bg-scout-sage',
  FUNDRAISER: 'bg-scout-amber',
  SPECIAL: 'bg-scout-campfire',
};

function getEventCategory(event: Event): EventCategory {
  // Derive category from title/description keywords if no explicit category
  const text = `${event.title} ${event.description || ''} ${event.content || ''}`.toLowerCase();
  if (text.includes('campout') || text.includes('camping') || text.includes('hike')) return 'CAMPOUT';
  if (text.includes('service') || text.includes('volunteer')) return 'SERVICE';
  if (text.includes('fundrais') || text.includes('popcorn') || text.includes('wreath')) return 'FUNDRAISER';
  if (text.includes('ceremony') || text.includes('court of honor') || text.includes('special')) return 'SPECIAL';
  return 'MEETING';
}

interface EventCardProps {
  event: Event;
  category?: EventCategory;
}

export default function EventCard({ event, category }: EventCardProps) {
  const start = parseISO(event.startDate);
  const end = event.endDate ? parseISO(event.endDate) : null;
  const resolvedCategory = category || getEventCategory(event);
  const cat = categoryConfig[resolvedCategory];
  const accent = categoryAccent[resolvedCategory];

  const monthAbbr = format(start, 'MMM').toUpperCase();
  const dayNum = format(start, 'd');

  const timeDisplay = end
    ? `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
    : format(start, 'h:mm a');

  const descriptionText = (event.description || event.content || '')
    .replace(/<[^>]*>/g, '')
    .slice(0, 140);

  return (
    <Link to={`/events/${event.slug}`} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="card flex overflow-hidden"
      >
        {/* Date Badge */}
        <div
          className={`flex-shrink-0 w-20 sm:w-24 flex flex-col items-center justify-center ${accent} text-white`}
        >
          <span className="text-xs font-body font-semibold tracking-widest uppercase opacity-90">
            {monthAbbr}
          </span>
          <span className="text-3xl sm:text-4xl font-heading font-bold leading-none mt-0.5">
            {dayNum}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-scout-navy group-hover:text-scout-forest transition-colors duration-200 truncate">
              {event.title}
            </h3>
            <span
              className={`flex-shrink-0 text-xs font-body font-semibold px-2.5 py-1 rounded-full ${cat.bg} ${cat.color} ${cat.border} border`}
            >
              {cat.label}
            </span>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-sm text-scout-slate">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} className="text-scout-sky flex-shrink-0" />
              {timeDisplay}
            </span>
            {event.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-scout-sky flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
          </div>

          {descriptionText && (
            <p className="mt-2 text-sm text-scout-slate/80 line-clamp-2 font-body">
              {descriptionText}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export { getEventCategory, type EventCategory };
