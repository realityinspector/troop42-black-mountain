import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Send,
  Mail,
  MapPin,
  Clock,
  Facebook,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import SEO from '@/components/SEO';
import AnimatedSection from '@/components/AnimatedSection';
import { submitContact } from '@/lib/api';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitContact(form);
      setIsSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Troop 42 Black Mountain. We'd love to hear from you about joining our troop, events, or any questions you may have."
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-hero-mountains py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="topo-bg w-full h-full" />
        </div>
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
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              Contact Us
            </h1>
            <p className="font-body text-lg text-scout-mist/80 mt-4 max-w-xl mx-auto">
              We'd love to hear from you. Reach out with questions, or to learn
              about joining Troop 42.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Content ──────────────────────────── */}
      <section className="py-16 md:py-24 bg-scout-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 p-6 md:p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <CheckCircle className="w-16 h-16 text-scout-sage mx-auto mb-4" />
                      <h2 className="font-heading text-2xl font-bold text-scout-forest mb-2">
                        Message Sent!
                      </h2>
                      <p className="font-body text-scout-slate mb-6">
                        Thank you for reaching out. We'll get back to you as soon as
                        possible.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="btn-primary"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="font-heading text-2xl font-bold text-scout-navy mb-6">
                        Send Us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label
                              htmlFor="name"
                              className="block font-body text-sm font-semibold text-scout-navy mb-1.5"
                            >
                              Your Name <span className="text-scout-ember">*</span>
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                              className={`w-full px-4 py-2.5 rounded-lg border font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-scout-gold/50 transition-shadow ${
                                errors.name
                                  ? 'border-scout-ember focus:border-scout-ember'
                                  : 'border-scout-khaki/40 focus:border-scout-gold'
                              }`}
                              placeholder="John Smith"
                            />
                            {errors.name && (
                              <p className="mt-1 font-body text-xs text-scout-ember">
                                {errors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block font-body text-sm font-semibold text-scout-navy mb-1.5"
                            >
                              Email Address <span className="text-scout-ember">*</span>
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                              className={`w-full px-4 py-2.5 rounded-lg border font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-scout-gold/50 transition-shadow ${
                                errors.email
                                  ? 'border-scout-ember focus:border-scout-ember'
                                  : 'border-scout-khaki/40 focus:border-scout-gold'
                              }`}
                              placeholder="john@example.com"
                            />
                            {errors.email && (
                              <p className="mt-1 font-body text-xs text-scout-ember">
                                {errors.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="subject"
                            className="block font-body text-sm font-semibold text-scout-navy mb-1.5"
                          >
                            Subject <span className="text-scout-ember">*</span>
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-scout-gold/50 transition-shadow ${
                              errors.subject
                                ? 'border-scout-ember focus:border-scout-ember'
                                : 'border-scout-khaki/40 focus:border-scout-gold'
                            }`}
                          >
                            <option value="">Select a subject...</option>
                            <option value="joining">Interested in Joining</option>
                            <option value="events">Question About Events</option>
                            <option value="volunteering">Volunteering</option>
                            <option value="fundraising">Fundraising</option>
                            <option value="general">General Inquiry</option>
                          </select>
                          {errors.subject && (
                            <p className="mt-1 font-body text-xs text-scout-ember">
                              {errors.subject}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block font-body text-sm font-semibold text-scout-navy mb-1.5"
                          >
                            Message <span className="text-scout-ember">*</span>
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={6}
                            value={form.message}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-scout-gold/50 transition-shadow resize-y ${
                              errors.message
                                ? 'border-scout-ember focus:border-scout-ember'
                                : 'border-scout-khaki/40 focus:border-scout-gold'
                            }`}
                            placeholder="Tell us how we can help..."
                          />
                          {errors.message && (
                            <p className="mt-1 font-body text-xs text-scout-ember">
                              {errors.message}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <AnimatedSection direction="right" delay={0.1}>
                {/* Meeting Info */}
                <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 p-6">
                  <h3 className="font-heading text-lg font-bold text-scout-navy mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-scout-gold" />
                    Meeting Info
                  </h3>
                  <div className="space-y-3 font-body text-sm text-scout-navy/80">
                    <p>
                      <strong className="text-scout-navy">When:</strong>
                      <br />
                      Weekly meetings (contact for schedule)
                    </p>
                    <p>
                      <strong className="text-scout-navy">Where:</strong>
                      <br />
                      Black Mountain, NC
                      <br />
                      <span className="text-scout-slate text-xs">
                        Exact location provided upon inquiry
                      </span>
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.2}>
                {/* Connect */}
                <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 p-6">
                  <h3 className="font-heading text-lg font-bold text-scout-navy mb-4">
                    Connect With Us
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="mailto:info@troop42blackmountain.org"
                        className="flex items-center gap-3 font-body text-sm text-scout-navy/80 hover:text-scout-forest transition-colors"
                      >
                        <Mail className="w-4 h-4 text-scout-gold flex-shrink-0" />
                        info@troop42blackmountain.org
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 font-body text-sm text-scout-navy/80 hover:text-scout-forest transition-colors"
                      >
                        <Facebook className="w-4 h-4 text-scout-gold flex-shrink-0" />
                        Follow us on Facebook
                      </a>
                    </li>
                    <li>
                      <div className="flex items-start gap-3 font-body text-sm text-scout-navy/80">
                        <MapPin className="w-4 h-4 text-scout-gold flex-shrink-0 mt-0.5" />
                        <span>Black Mountain, NC</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.3}>
                {/* Map Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-scout-khaki/20 overflow-hidden">
                  <div className="aspect-[4/3] bg-scout-mist flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="w-8 h-8 text-scout-sage mx-auto mb-2" />
                      <p className="font-body text-sm text-scout-slate">
                        Black Mountain, NC
                      </p>
                      <a
                        href="https://www.google.com/maps/place/Black+Mountain,+NC/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-scout-forest text-xs font-body font-semibold hover:underline"
                      >
                        View on Google Maps
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.4}>
                {/* Join CTA */}
                <div className="bg-scout-forest rounded-xl p-6 text-white">
                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    Interested in Joining?
                  </h3>
                  <p className="font-body text-sm text-scout-meadow/80 mb-4 leading-relaxed">
                    Families interested in joining Troop 42 or learning more about
                    Scouts BSA can visit the official BSA website.
                  </p>
                  <a
                    href="https://www.scouting.org/programs/scouts-bsa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-scout-gold text-scout-forest font-body font-semibold text-sm rounded-lg hover:bg-scout-amber transition-colors"
                  >
                    Learn About Scouts BSA
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
