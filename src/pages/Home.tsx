import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Users,
  Heart,
  ExternalLink,
  Compass,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import SEO from '@/components/SEO';
import AnimatedSection, { AnimatedChild } from '@/components/AnimatedSection';
import { getEvents, getPosts, type Event, type Post } from '@/lib/api';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [latestPost, setLatestPost] = useState<Post | null>(null);

  useEffect(() => {
    getEvents({ limit: 3, published: true })
      .then(setEvents)
      .catch(() => {});
    getPosts({ limit: 1, category: 'scoutmaster', published: true })
      .then((posts) => setLatestPost(posts[0] || null))
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO />

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-mountains min-h-[85vh] flex items-center">
        {/* Subtle topo pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="topo-bg w-full h-full" />
        </div>

        {/* Mountain silhouette layer */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,224L60,208C120,192,240,160,360,144C480,128,600,128,720,149.3C840,171,960,213,1080,218.7C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              fill="#1B4332"
              fillOpacity="0.3"
            />
            <path
              d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,234.7C672,224,768,224,864,234.7C960,245,1056,267,1152,261.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="#FDF6E3"
            />
          </svg>
        </div>

        {/* Animated Compass */}
        <motion.div
          className="absolute top-20 right-10 md:right-20 lg:right-32 opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Compass className="w-32 h-32 md:w-48 md:h-48 text-scout-gold" strokeWidth={0.8} />
        </motion.div>

        <div className="container-wide relative z-10 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-scout-gold/20 text-scout-gold text-sm font-body font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-scout-gold animate-pulse" />
              Scouts BSA Family Troop
            </motion.div>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight">
              TROOP 42
            </h1>
            <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-scout-gold mt-2 tracking-wide">
              BLACK MOUNTAIN
            </p>
            <p className="font-body text-lg md:text-xl text-scout-mist/90 mt-6 max-w-lg leading-relaxed">
              Adventure awaits in every trail. Join us for character-building
              experiences through outdoor adventure, community service, and the
              timeless values of Scouting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/events"
                className="btn-secondary text-base"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Events
              </Link>
              <a
                href="https://www.scouting.org/programs/scouts-bsa/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white text-white hover:bg-white hover:text-scout-forest text-base"
              >
                Join Our Troop
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming Events ────────────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-cream">
        <div className="container-wide">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-heading">Upcoming Events</h2>
                <p className="section-subheading">
                  What's next on the trail for Troop 42
                </p>
              </div>
              <Link
                to="/events"
                className="hidden sm:flex items-center gap-1.5 text-scout-forest font-body font-semibold text-sm hover:text-scout-pine transition-colors"
              >
                All Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          {events.length > 0 ? (
            <AnimatedSection staggerChildren={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <AnimatedChild key={event.id}>
                    <Link
                      to={`/events/${event.slug}`}
                      className="card group flex flex-col h-full"
                    >
                      {event.imageUrl && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      )}
                      <div className="flex-1 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-scout-forest text-white text-xs font-body font-semibold rounded-md">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(event.startDate), 'MMM d')}
                          </span>
                          {event.location && (
                            <span className="inline-flex items-center gap-1 text-scout-slate text-xs font-body">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-xl font-bold text-scout-navy group-hover:text-scout-forest transition-colors">
                          {event.title}
                        </h3>
                        <p className="font-body text-sm text-scout-slate mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      <div className="px-5 pb-4">
                        <span className="inline-flex items-center gap-1 text-scout-forest text-sm font-body font-semibold group-hover:gap-2 transition-all">
                          Learn more <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </AnimatedChild>
                ))}
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection>
              <div className="text-center py-12 parchment-bg rounded-xl">
                <Calendar className="w-12 h-12 text-scout-sage mx-auto mb-3" />
                <p className="font-body text-scout-slate">
                  Upcoming events will appear here. Check back soon!
                </p>
              </div>
            </AnimatedSection>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-scout-forest font-body font-semibold text-sm"
            >
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scoutmaster's Corner ───────────────────────── */}
      <section className="py-16 md:py-24 parchment-bg">
        <div className="container-wide">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-scout-forest flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-scout-gold" />
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-scout-forest">
                  Scoutmaster's Corner
                </h2>
              </div>

              {latestPost ? (
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-scout-khaki/30 relative">
                  {/* Decorative corner fold */}
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[48px] border-l-transparent border-t-[48px] border-t-scout-parchment" />
                  </div>

                  <h3 className="font-heading text-xl md:text-2xl font-bold text-scout-navy mb-3">
                    {latestPost.title}
                  </h3>
                  <p className="font-body text-xs text-scout-slate mb-4">
                    {format(new Date(latestPost.createdAt), 'MMMM d, yyyy')}
                    {latestPost.author && ` by ${latestPost.author.name}`}
                  </p>
                  <p className="font-body text-scout-navy/80 leading-relaxed line-clamp-4">
                    {latestPost.excerpt || latestPost.content?.replace(/<[^>]+>/g, '').slice(0, 300)}
                  </p>
                  <Link
                    to={`/blog/${latestPost.slug}`}
                    className="inline-flex items-center gap-1.5 mt-4 text-scout-forest font-body font-semibold text-sm hover:text-scout-pine transition-colors"
                  >
                    Read full post <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-scout-khaki/30">
                  <p className="font-body text-scout-slate italic">
                    The Scoutmaster's latest thoughts and updates will appear here.
                    Stay tuned for words from the trail.
                  </p>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Quick Links Grid ───────────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-cream">
        <div className="container-wide">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="section-heading">Explore Troop 42</h2>
              <p className="section-subheading">
                Everything you need, all in one place
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection staggerChildren={0.08}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  to: '/events',
                  label: 'Events',
                  description: 'Campouts, hikes, and troop meetings',
                  icon: Calendar,
                  color: 'bg-scout-forest',
                },
                {
                  to: '/resources',
                  label: 'Resources',
                  description: 'Forms, gear lists, and handbooks',
                  icon: BookOpen,
                  color: 'bg-scout-navy',
                },
                {
                  to: '/fundraising',
                  label: 'Fundraising',
                  description: 'Christmas tree sale and more',
                  icon: Heart,
                  color: 'bg-scout-campfire',
                },
                {
                  to: '/about',
                  label: 'About Us',
                  description: 'Our troop history and values',
                  icon: Users,
                  color: 'bg-scout-pine',
                },
                {
                  to: '/contact',
                  label: 'Contact',
                  description: 'Get in touch with our troop',
                  icon: MapPin,
                  color: 'bg-scout-slate',
                },
                {
                  to: 'https://www.scouting.org/programs/scouts-bsa/',
                  label: 'Join BSA',
                  description: 'Start your scouting journey',
                  icon: Compass,
                  color: 'bg-scout-gold',
                  external: true,
                },
              ].map((item) => (
                <AnimatedChild key={item.label}>
                  {item.external ? (
                    <a
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card group p-5 md:p-6 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300"
                    >
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <h3 className="font-heading text-base md:text-lg font-bold text-scout-navy">
                        {item.label}
                      </h3>
                      <p className="font-body text-xs md:text-sm text-scout-slate mt-1 hidden sm:block">
                        {item.description}
                      </p>
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      className="card group p-5 md:p-6 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300"
                    >
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <h3 className="font-heading text-base md:text-lg font-bold text-scout-navy">
                        {item.label}
                      </h3>
                      <p className="font-body text-xs md:text-sm text-scout-slate mt-1 hidden sm:block">
                        {item.description}
                      </p>
                    </Link>
                  )}
                </AnimatedChild>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Scout Values Section ───────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-forest text-white relative overflow-hidden">
        {/* Topo overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="topo-bg w-full h-full" />
        </div>

        <div className="container-narrow relative z-10">
          <AnimatedSection direction="fade">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 rounded-full bg-scout-gold/20 flex items-center justify-center mx-auto mb-6"
              >
                <Compass className="w-8 h-8 text-scout-gold" />
              </motion.div>

              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-8">
                The Scout Oath
              </h2>

              <blockquote className="font-heading text-xl md:text-2xl lg:text-3xl text-scout-meadow leading-relaxed italic max-w-2xl mx-auto">
                "On my honor I will do my best to do my duty to God and my country
                and to obey the Scout Law; to help other people at all times; to
                keep myself physically strong, mentally awake, and morally straight."
              </blockquote>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {[
                  'Trustworthy',
                  'Loyal',
                  'Helpful',
                  'Friendly',
                  'Courteous',
                  'Kind',
                  'Obedient',
                  'Cheerful',
                  'Thrifty',
                  'Brave',
                  'Clean',
                  'Reverent',
                ].map((value, i) => (
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    className="px-3 py-1.5 rounded-full bg-scout-gold/15 text-scout-gold text-sm font-body font-semibold border border-scout-gold/20"
                  >
                    {value}
                  </motion.span>
                ))}
              </div>

              <p className="mt-8 font-body text-scout-meadow/70 text-sm max-w-md mx-auto">
                These twelve points of the Scout Law guide everything we do at Troop 42.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
