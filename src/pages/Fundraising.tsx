import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TreePine,
  Calendar,
  MapPin,
  DollarSign,
  Heart,
  Gift,
  Users,
  Tent,
  Award,
  HandHeart,
  ExternalLink,
} from 'lucide-react';
import SEO from '@/components/SEO';
import AnimatedSection, { AnimatedChild } from '@/components/AnimatedSection';

export default function Fundraising() {
  return (
    <>
      <SEO
        title="Fundraising"
        description="Support Troop 42 Black Mountain through our annual Christmas tree sale and other fundraising activities. Your support helps scouts build skills and character."
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-scout-forest via-scout-pine to-scout-navy py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="topo-bg w-full h-full" />
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 right-10 md:right-20 opacity-10"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TreePine className="w-24 h-24 md:w-40 md:h-40 text-scout-gold" strokeWidth={0.8} />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0,64L1440,96L1440,120L0,120Z" fill="#FDF6E3" />
          </svg>
        </div>

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-scout-gold/20 text-scout-gold text-sm font-body font-semibold mb-6">
              <Heart className="w-4 h-4" />
              Supporting Our Scouts
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              Fundraising
            </h1>
            <p className="font-body text-lg text-scout-mist/80 mt-4 max-w-xl mx-auto">
              Your support helps our scouts learn, grow, and explore. Every
              contribution fuels adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Christmas Tree Sale ──────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-cream">
        <div className="container-wide">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-scout-forest/10 mb-4">
                <TreePine className="w-8 h-8 text-scout-forest" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-scout-navy">
                Annual Christmas Tree Sale
              </h2>
              <p className="section-subheading mt-2">
                Our biggest fundraiser of the year
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatedSection direction="left">
                <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 overflow-hidden">
                  {/* Festive header */}
                  <div className="bg-gradient-to-r from-scout-forest to-scout-pine p-6 md:p-8 text-white">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <TreePine className="w-7 h-7 text-scout-gold" />
                      </div>
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-white">
                          Fresh-Cut Christmas Trees
                        </h3>
                        <p className="font-body text-scout-meadow/80 mt-1">
                          Premium Fraser Firs from the mountains of North Carolina
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    <p className="font-body text-scout-navy/80 leading-relaxed">
                      Every holiday season, Troop 42 Black Mountain hosts our annual
                      Christmas tree sale featuring beautiful, fresh-cut Fraser Fir trees
                      sourced from local North Carolina tree farms. This is our troop's
                      primary fundraiser and a beloved community tradition.
                    </p>
                    <p className="font-body text-scout-navy/80 leading-relaxed">
                      Our scouts help with everything from unloading the trees to helping
                      families select and load their perfect tree. It's a wonderful
                      learning experience in customer service, teamwork, and community
                      engagement.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-scout-parchment rounded-lg">
                        <Calendar className="w-5 h-5 text-scout-campfire flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-body font-semibold text-scout-navy text-sm">
                            When
                          </h4>
                          <p className="font-body text-sm text-scout-slate">
                            Late November through December
                            <br />
                            <span className="text-xs text-scout-slate/60">
                              Dates announced each fall
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-scout-parchment rounded-lg">
                        <MapPin className="w-5 h-5 text-scout-campfire flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-body font-semibold text-scout-navy text-sm">
                            Where
                          </h4>
                          <p className="font-body text-sm text-scout-slate">
                            Black Mountain, NC
                            <br />
                            <span className="text-xs text-scout-slate/60">
                              Location announced each season
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-scout-amber/5 border border-scout-amber/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-scout-amber flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-body font-semibold text-scout-navy text-sm">
                          Pricing
                        </h4>
                        <p className="font-body text-sm text-scout-slate">
                          Competitive prices for premium Fraser Firs in a variety of sizes.
                          Pricing details are announced each season. Wreaths and garlands
                          may also be available.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar highlights */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatedSection direction="right" delay={0.1}>
                <div className="bg-scout-campfire/5 border border-scout-campfire/20 rounded-xl p-6">
                  <Gift className="w-8 h-8 text-scout-campfire mb-3" />
                  <h3 className="font-heading text-lg font-bold text-scout-navy mb-2">
                    A Community Tradition
                  </h3>
                  <p className="font-body text-sm text-scout-navy/70 leading-relaxed">
                    For years, families in the Black Mountain area have made choosing
                    their Christmas tree from Troop 42 a holiday tradition. Your tree
                    purchase directly supports our scouts.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.2}>
                <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 p-6">
                  <h3 className="font-heading text-lg font-bold text-scout-navy mb-3">
                    Stay Updated
                  </h3>
                  <p className="font-body text-sm text-scout-navy/70 mb-4">
                    Want to know when the tree lot opens? Follow us on social media
                    or check our events page for the latest announcements.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/events"
                      className="btn-primary text-sm py-2"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Events
                    </Link>
                    <Link
                      to="/contact"
                      className="btn-outline text-sm py-2"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── How Funds Help ───────────────────────────── */}
      <section className="py-16 md:py-24 parchment-bg">
        <div className="container-wide">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="section-heading">How Your Support Helps</h2>
              <p className="section-subheading">
                Every dollar raised goes directly toward enriching our scouts' experiences
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection staggerChildren={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Tent,
                  title: 'Camping & Equipment',
                  description: 'Tents, cooking gear, and supplies for monthly campouts and outdoor adventures.',
                  color: 'bg-scout-forest',
                },
                {
                  icon: Award,
                  title: 'Merit Badges',
                  description: 'Materials and resources for skill-building merit badge programs.',
                  color: 'bg-scout-gold',
                },
                {
                  icon: Users,
                  title: 'Training & Leadership',
                  description: 'Youth and adult leader training programs and development opportunities.',
                  color: 'bg-scout-navy',
                },
                {
                  icon: HandHeart,
                  title: 'Community Service',
                  description: 'Supplies and logistics for service projects in the Black Mountain community.',
                  color: 'bg-scout-campfire',
                },
              ].map((item) => (
                <AnimatedChild key={item.title}>
                  <div className="card p-6 h-full">
                    <div
                      className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-scout-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-scout-slate leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </AnimatedChild>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Other Ways to Support ────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-cream">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="section-heading">Other Ways to Support</h2>
              <p className="section-subheading">
                There are many ways to make a difference for our scouts
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="space-y-4">
              {[
                {
                  title: 'Volunteer Your Time',
                  description:
                    'Become an adult volunteer. Whether you have outdoor skills, professional expertise, or simply a desire to mentor youth, we welcome your involvement.',
                },
                {
                  title: 'Donate Equipment',
                  description:
                    'Gently used camping gear, first aid supplies, and outdoor equipment are always appreciated. Contact us to arrange a donation.',
                },
                {
                  title: 'Spread the Word',
                  description:
                    'Tell families about Troop 42. Share our events on social media and help us grow our scouting family in Black Mountain.',
                },
                {
                  title: 'Corporate Sponsorship',
                  description:
                    'Local businesses can partner with Troop 42 through sponsorships. Contact us to learn about sponsorship opportunities.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 p-5 md:p-6 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-scout-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-heading text-sm font-bold text-scout-gold">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-scout-navy">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-scout-slate mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-scout-campfire to-scout-ember text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="topo-bg w-full h-full" />
        </div>

        <div className="container-narrow relative z-10 text-center">
          <AnimatedSection direction="fade">
            <Heart className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Help?
            </h2>
            <p className="font-body text-lg text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
              Whether you want to buy a tree, volunteer, or learn about other ways to
              support Troop 42, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-body font-semibold text-scout-campfire bg-white hover:bg-scout-cream transition-colors"
              >
                Get in Touch
              </Link>
              <a
                href="https://www.scouting.org/programs/scouts-bsa/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white text-white hover:bg-white hover:text-scout-campfire"
              >
                Join Scouts BSA
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
