import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, MapPin, Clock, X } from 'lucide-react';
import type { Event } from '@/lib/api';
import { getEventCategory, type EventCategory } from '@/components/EventCard';

const categoryDot: Record<EventCategory, string> = {
  MEETING: 'bg-scout-pine',
  CAMPOUT: 'bg-scout-forest',
  SERVICE: 'bg-scout-sage',
  FUNDRAISER: 'bg-scout-amber',
  SPECIAL: 'bg-scout-campfire',
};

const categoryLabel: Record<EventCategory, string> = {
  MEETING: 'Meeting',
  CAMPOUT: 'Campout',
  SERVICE: 'Service',
  FUNDRAISER: 'Fundraiser',
  SPECIAL: 'Special',
};

interface CalendarViewProps {
  events: Event[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    [calendarStart.getTime(), calendarEnd.getTime()]
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((event) => {
      const key = format(parseISO(event.startDate), 'yyyy-MM-dd');
      const existing = map.get(key) || [];
      existing.push(event);
      map.set(key, existing);
    });
    return map;
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    const key = format(selectedDay, 'yyyy-MM-dd');
    return eventsByDay.get(key) || [];
  }, [selectedDay, eventsByDay]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Mobile: upcoming events as a scrollable list for the current month
  const monthEvents = useMemo(() => {
    return events
      .filter((e) => {
        const d = parseISO(e.startDate);
        return isSameMonth(d, currentMonth);
      })
      .sort(
        (a, b) =>
          parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
      );
  }, [events, currentMonth]);

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-scout-mist transition-colors text-scout-slate hover:text-scout-forest"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-scout-navy">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-scout-mist transition-colors text-scout-slate hover:text-scout-forest"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Desktop Calendar Grid */}
      <div className="hidden md:block">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-body font-semibold text-scout-slate/70 uppercase tracking-wider py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-t border-l border-scout-khaki/20 rounded-lg overflow-hidden">
          {calendarDays.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDay.get(key) || [];
            const inMonth = isSameMonth(day, currentMonth);
            const today = isToday(day);
            const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
            const hasEvents = dayEvents.length > 0;

            return (
              <button
                key={key}
                onClick={() =>
                  hasEvents
                    ? setSelectedDay(isSelected ? null : day)
                    : setSelectedDay(null)
                }
                className={`
                  relative min-h-[80px] p-2 border-r border-b border-scout-khaki/20
                  text-left transition-colors duration-150
                  ${inMonth ? 'bg-white' : 'bg-scout-cream/50'}
                  ${hasEvents ? 'cursor-pointer hover:bg-scout-mist/50' : 'cursor-default'}
                  ${isSelected ? 'bg-scout-mist ring-2 ring-inset ring-scout-pine/40' : ''}
                `}
              >
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 text-sm font-body font-medium rounded-full
                    ${today ? 'bg-scout-forest text-white' : ''}
                    ${!today && inMonth ? 'text-scout-navy' : ''}
                    ${!inMonth ? 'text-scout-slate/30' : ''}
                  `}
                >
                  {format(day, 'd')}
                </span>

                {/* Event Dots */}
                {dayEvents.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {dayEvents.slice(0, 3).map((evt) => (
                      <span
                        key={evt.id}
                        className={`w-2 h-2 rounded-full ${categoryDot[getEventCategory(evt)]}`}
                        title={evt.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-scout-slate/60 font-body leading-none self-center">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Event titles (first 2) */}
                {dayEvents.slice(0, 2).map((evt) => {
                  const evtCat = getEventCategory(evt);
                  return (
                    <div
                      key={evt.id}
                      className={`mt-0.5 text-[10px] leading-tight font-body truncate px-1 py-0.5 rounded ${categoryDot[evtCat]}/10 text-scout-navy/80`}
                    >
                      {evt.title}
                    </div>
                  );
                })}
              </button>
            );
          })}
        </div>

        {/* Selected Day Detail Panel */}
        <AnimatePresence>
          {selectedDay && selectedDayEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 bg-white rounded-xl shadow-md border border-scout-khaki/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-lg font-semibold text-scout-navy">
                    {format(selectedDay, 'EEEE, MMMM d, yyyy')}
                  </h4>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-1 rounded hover:bg-scout-mist transition-colors text-scout-slate"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedDayEvents.map((evt) => {
                    const evtCat = getEventCategory(evt);
                    return (
                      <Link
                        key={evt.id}
                        to={`/events/${evt.slug}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-scout-mist/50 transition-colors group"
                      >
                        <span
                          className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${categoryDot[evtCat]}`}
                        />
                        <div className="min-w-0">
                          <p className="font-body font-semibold text-scout-navy group-hover:text-scout-forest transition-colors">
                            {evt.title}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-scout-slate/70">
                            <span className="inline-flex items-center gap-1">
                              <Clock size={11} />
                              {format(parseISO(evt.startDate), 'h:mm a')}
                            </span>
                            {evt.location && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={11} />
                                {evt.location}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${categoryDot[evtCat]}/10`}
                            >
                              {categoryLabel[evtCat]}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: Scrollable Event List for Month */}
      <div className="md:hidden">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {(Object.entries(categoryDot) as [EventCategory, string][]).map(
            ([cat, dotClass]) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 text-xs text-scout-slate/70 font-body"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
                {categoryLabel[cat]}
              </span>
            )
          )}
        </div>

        {monthEvents.length === 0 ? (
          <div className="text-center py-12 text-scout-slate/60 font-body">
            <p>No events this month.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthEvents.map((evt) => {
              const start = parseISO(evt.startDate);
              const evtCat = getEventCategory(evt);
              return (
                <Link
                  key={evt.id}
                  to={`/events/${evt.slug}`}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-scout-khaki/15 hover:shadow-md transition-shadow"
                >
                  {/* Date */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="text-xs font-body font-semibold text-scout-slate/60 uppercase">
                      {format(start, 'MMM')}
                    </div>
                    <div className="text-2xl font-heading font-bold text-scout-navy leading-none mt-0.5">
                      {format(start, 'd')}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${categoryDot[evtCat]}`}
                      />
                      <div className="min-w-0">
                        <p className="font-body font-semibold text-scout-navy truncate">
                          {evt.title}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-scout-slate/70 font-body">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={11} />
                            {format(start, 'h:mm a')}
                          </span>
                          {evt.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={11} />
                              {evt.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
