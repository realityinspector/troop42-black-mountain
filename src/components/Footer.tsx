import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Facebook } from 'lucide-react';
import logoUrl from '@/assets/brand/logo.svg';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/blog', label: 'Blog' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: 'https://www.scouting.org/programs/scouts-bsa/', label: 'Join Scouting', external: true },
];

const connectLinks = [
  {
    href: 'https://www.facebook.com/',
    label: 'Facebook',
    icon: Facebook,
  },
  {
    href: 'mailto:info@troop42blackmountain.org',
    label: 'Email Us',
    icon: Mail,
  },
  {
    href: 'https://www.scouting.org/',
    label: 'Scouting.org',
    icon: ExternalLink,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="topo-bg text-scout-cream" role="contentinfo">
      {/* Main Footer */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4" aria-label="Home">
              <img
                src={logoUrl}
                alt="Troop 42 Black Mountain"
                className="h-16 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-scout-meadow/80 text-sm font-body leading-relaxed">
              Building character, citizenship, and outdoor skills through adventure
              and service in the Black Mountain community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold text-scout-gold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-scout-meadow/80 hover:text-scout-gold transition-colors text-sm font-body"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-scout-meadow/80 hover:text-scout-gold transition-colors text-sm font-body"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="font-heading text-lg font-bold text-scout-gold mb-4">
              Connect With Us
            </h3>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="flex items-center gap-2.5 text-scout-meadow/80 hover:text-scout-gold transition-colors text-sm font-body"
                  >
                    <link.icon className="w-4 h-4 flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Join BSA CTA */}
            <div className="mt-6">
              <a
                href="https://www.scouting.org/programs/scouts-bsa/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-scout-gold text-scout-forest font-body font-semibold text-sm rounded-lg hover:bg-scout-amber transition-colors"
              >
                Join Scouts BSA
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg font-bold text-scout-gold mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-scout-meadow/80 text-sm font-body">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Black Mountain, NC
                  <br />
                  Meeting location available upon request
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-scout-meadow/80 text-sm font-body">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:info@troop42blackmountain.org"
                  className="hover:text-scout-gold transition-colors"
                >
                  info@troop42blackmountain.org
                </a>
              </li>
            </ul>
            <p className="mt-4 text-scout-meadow/60 text-xs font-body leading-relaxed">
              Meetings are held weekly. Contact us for schedule details and to
              learn about joining our troop.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-scout-pine/40">
        <div className="container-wide py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-scout-meadow/60 text-xs font-body text-center sm:text-left">
            &copy; {currentYear} Troop 42 Black Mountain. All rights reserved.
          </p>
          <p className="text-scout-meadow/40 text-xs font-body text-center sm:text-right max-w-md">
            Scouts BSA and the Scouts BSA logo are registered trademarks of Boy Scouts of America.
          </p>
        </div>
      </div>
    </footer>
  );
}
