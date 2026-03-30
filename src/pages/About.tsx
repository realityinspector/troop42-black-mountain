import { motion } from 'framer-motion';
import { ExternalLink, Compass, Users, Mountain, Award, BookOpen } from 'lucide-react';
import SEO from '@/components/SEO';
import AnimatedSection, { AnimatedChild } from '@/components/AnimatedSection';

const timeline = [
  {
    year: '1910',
    title: 'BSA Founded',
    description: 'The Boy Scouts of America is incorporated on February 8, 1910, bringing Scouting to the United States.',
  },
  {
    year: '1911',
    title: 'First Handbook Published',
    description: 'The first official Boy Scout Handbook is published, establishing the core of Scouting education.',
  },
  {
    year: '1972',
    title: 'Exploring Opens to Young Women',
    description: 'BSA begins opening certain programs to young women, expanding the reach of Scouting.',
  },
  {
    year: '2019',
    title: 'Scouts BSA Welcomes All',
    description: 'The program formerly known as Boy Scouts is renamed Scouts BSA and opens to young women and men.',
  },
  {
    year: 'Today',
    title: 'Troop 42 Carries the Torch',
    description: 'Troop 42 Black Mountain continues the proud tradition of Scouting with a family-focused approach to adventure.',
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="Learn about Troop 42 Black Mountain, our values, history, and commitment to the Scouts BSA mission of building character through outdoor adventure."
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-hero-mountains py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="topo-bg w-full h-full" />
        </div>

        {/* Mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0,160L120,144C240,128,480,96,720,106.7C960,117,1200,171,1320,197.3L1440,224L1440,200L1320,200C1200,200,960,200,720,200C480,200,240,200,120,200L0,200Z" fill="#FDF6E3" />
          </svg>
        </div>

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              About Our Troop
            </h1>
            <p className="font-body text-lg text-scout-mist/80 mt-4 max-w-2xl mx-auto">
              Troop 42 Black Mountain is a family-focused Scouts BSA troop
              dedicated to building strong character through outdoor adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Our Troop ────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scout-forest/10 text-scout-forest text-sm font-body font-semibold mb-4">
                  <Users className="w-4 h-4" />
                  Our Troop
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-scout-navy mb-6">
                  Where Adventure Meets Character
                </h2>
                <div className="space-y-4 font-body text-scout-navy/80 leading-relaxed">
                  <p>
                    Troop 42 Black Mountain is a vibrant Scouts BSA troop nestled in the
                    beautiful Blue Ridge Mountains of western North Carolina. We are a
                    family scouting unit, welcoming scouts of all backgrounds to join our
                    outdoor adventures.
                  </p>
                  <p>
                    Our troop is led by dedicated adult volunteers who are passionate about
                    youth development and the outdoors. We believe that the best classroom
                    is the great outdoors, where scouts learn leadership, teamwork,
                    self-reliance, and service to others.
                  </p>
                  <p>
                    From weekend campouts in the Pisgah National Forest to community
                    service projects in Black Mountain, our scouts are always on the move.
                    We emphasize Scout-led programming, empowering our youth to plan and
                    execute their own adventures under the guidance of trained adult
                    leaders.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Mountain, label: 'Outdoor Adventures', desc: 'Monthly campouts and hikes' },
                  { icon: Award, label: 'Merit Badges', desc: 'Skill-building opportunities' },
                  { icon: Users, label: 'Scout-Led', desc: 'Youth leadership development' },
                  { icon: Compass, label: 'Navigation', desc: 'Orienteering and map skills' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="card p-5 text-center"
                  >
                    <div className="w-10 h-10 rounded-lg bg-scout-forest/10 flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-5 h-5 text-scout-forest" />
                    </div>
                    <h3 className="font-heading text-sm font-bold text-scout-navy">
                      {item.label}
                    </h3>
                    <p className="font-body text-xs text-scout-slate mt-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Scout Oath & Law ─────────────────────────── */}
      <section className="py-16 md:py-24 parchment-bg">
        <div className="container-narrow">
          <AnimatedSection direction="fade">
            <div className="text-center mb-12">
              <BookOpen className="w-10 h-10 text-scout-gold mx-auto mb-4" />
              <h2 className="section-heading">Our Values</h2>
              <p className="section-subheading">
                The foundation of everything we do at Troop 42
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection direction="left" delay={0.1}>
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-scout-khaki/20 h-full">
                <h3 className="font-heading text-2xl font-bold text-scout-forest mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-scout-gold flex items-center justify-center text-white text-sm font-bold">O</span>
                  The Scout Oath
                </h3>
                <blockquote className="font-heading text-lg text-scout-navy leading-relaxed italic border-l-4 border-scout-gold pl-4">
                  On my honor I will do my best to do my duty to God and my country
                  and to obey the Scout Law; to help other people at all times; to
                  keep myself physically strong, mentally awake, and morally straight.
                </blockquote>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-scout-khaki/20 h-full">
                <h3 className="font-heading text-2xl font-bold text-scout-forest mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-scout-gold flex items-center justify-center text-white text-sm font-bold">L</span>
                  The Scout Law
                </h3>
                <p className="font-body text-scout-navy/80 leading-relaxed mb-4">
                  A Scout is:
                </p>
                <div className="grid grid-cols-2 gap-2">
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
                    <motion.div
                      key={value}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-center gap-2 font-body text-sm text-scout-navy"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-scout-gold flex-shrink-0" />
                      {value}
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Scouting Timeline ────────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-cream">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="section-heading">Scouting Through the Years</h2>
              <p className="section-subheading">
                A proud tradition of building character and leadership
              </p>
            </div>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-scout-sage/30 md:-translate-x-px" />

            {timeline.map((item, i) => (
              <AnimatedSection
                key={item.year}
                direction={i % 2 === 0 ? 'left' : 'right'}
                delay={0.1 * i}
              >
                <div
                  className={`relative flex items-start gap-6 mb-8 md:mb-12 ${
                    i % 2 === 0
                      ? 'md:flex-row md:text-right'
                      : 'md:flex-row-reverse md:text-left'
                  }`}
                >
                  {/* Content - mobile: always right, desktop: alternating */}
                  <div className="flex-1 pl-10 md:pl-0">
                    <div
                      className={`${
                        i % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                      }`}
                    >
                      <span className="inline-block px-3 py-1 bg-scout-gold text-white text-sm font-body font-bold rounded-md mb-2">
                        {item.year}
                      </span>
                      <h3 className="font-heading text-xl font-bold text-scout-navy">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm text-scout-slate mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-scout-gold border-2 border-white shadow-sm mt-2" />

                  {/* Spacer for desktop alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join Scouting CTA ────────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-forest text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="topo-bg w-full h-full" />
        </div>

        <div className="container-narrow relative z-10 text-center">
          <AnimatedSection direction="fade">
            <Compass className="w-12 h-12 text-scout-gold mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Join the Adventure?
            </h2>
            <p className="font-body text-lg text-scout-meadow/80 mb-8 max-w-xl mx-auto leading-relaxed">
              Whether you're a youth looking for adventure or a family seeking a community
              of character-builders, Troop 42 Black Mountain welcomes you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://www.scouting.org/programs/scouts-bsa/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Join Scouts BSA
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
              <a
                href="/contact"
                className="btn-outline border-white text-white hover:bg-white hover:text-scout-forest"
              >
                Contact Us
              </a>
            </div>
            <p className="mt-6 font-body text-sm text-scout-meadow/50">
              Visit{' '}
              <a
                href="https://www.scouting.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-scout-gold hover:underline"
              >
                scouting.org
              </a>{' '}
              to learn more about the Boy Scouts of America.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
