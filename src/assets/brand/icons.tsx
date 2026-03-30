import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const CompassIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z" />
    <polygon points="12,3.5 11.3,5.5 12.7,5.5" />
    <polygon points="12,20.5 11.3,18.5 12.7,18.5" />
    <polygon points="3.5,12 5.5,11.3 5.5,12.7" />
    <polygon points="20.5,12 18.5,11.3 18.5,12.7" />
    <path d="M14.5 9.5L10.2 10.2 9.5 14.5 13.8 13.8z" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <line x1="12" y1="6" x2="12" y2="7.5" stroke="currentColor" strokeWidth="0.6" />
    <line x1="12" y1="16.5" x2="12" y2="18" stroke="currentColor" strokeWidth="0.6" />
    <line x1="6" y1="12" x2="7.5" y2="12" stroke="currentColor" strokeWidth="0.6" />
    <line x1="16.5" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="0.6" />
  </svg>
);

export const CampfireIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Logs */}
    <path d="M4 20l7-3.5L18 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6 18.5l6 2.5 6-2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    {/* Main flame */}
    <path d="M12 4c0 0-4.5 4-4.5 8.5C7.5 15.5 9.5 17 12 17s4.5-1.5 4.5-4.5C16.5 8 12 4 12 4z" />
    {/* Inner flame */}
    <path d="M12 8c0 0-2.2 2.5-2.2 4.8C9.8 14.5 10.8 15.5 12 15.5s2.2-1 2.2-2.7C14.2 10.5 12 8 12 8z" opacity="0.4" />
    {/* Spark */}
    <circle cx="10" cy="6" r="0.5" />
    <circle cx="14.5" cy="5" r="0.4" />
  </svg>
);

export const TentIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Tent body */}
    <path d="M12 3L2 19h20L12 3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Center pole line */}
    <line x1="12" y1="3" x2="12" y2="19" stroke="currentColor" strokeWidth="0.8" />
    {/* Door opening */}
    <path d="M12 19l-2.5-6h5L12 19z" opacity="0.3" />
    {/* Ground line */}
    <line x1="1" y1="19" x2="23" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Flag */}
    <path d="M12 3l3 1.5L12 6" fill="currentColor" opacity="0.6" />
  </svg>
);

export const MountainIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Back mountain */}
    <polygon points="6,19 13,6 20,19" opacity="0.35" />
    {/* Front mountain */}
    <polygon points="2,19 9,4 16,19" />
    {/* Snow cap */}
    <polygon points="8,6.5 9,4 10,6.5 9.5,5.8 9,6.8 8.5,5.8" opacity="0.3" fill="currentColor" />
    {/* Ground */}
    <line x1="1" y1="19" x2="23" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const TreeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Tree layers */}
    <polygon points="12,2 7,9 17,9" />
    <polygon points="12,6 6,13 18,13" />
    <polygon points="12,10 5,17 19,17" />
    {/* Trunk */}
    <rect x="10.5" y="17" width="3" height="4" rx="0.5" />
    {/* Ground line */}
    <line x1="7" y1="21" x2="17" y2="21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const TrailIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Winding trail path */}
    <path
      d="M8 22 C8 22, 6 18, 10 15 C14 12, 8 10, 10 7 C12 4, 14 2, 14 2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="3,2"
    />
    {/* Trail markers/footprints */}
    <circle cx="9" cy="19" r="0.8" />
    <circle cx="11" cy="13" r="0.8" />
    <circle cx="9.5" cy="8.5" r="0.8" />
    <circle cx="12.5" cy="4" r="0.8" />
    {/* Small landscape elements */}
    <polygon points="18,18 19.5,14.5 21,18" opacity="0.3" />
    <polygon points="3,12 4.5,8.5 6,12" opacity="0.3" />
  </svg>
);

export const BackpackIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Top handle/loop */}
    <path d="M9 5 C9 3, 10 2, 12 2 C14 2, 15 3, 15 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Main body */}
    <rect x="6" y="5" width="12" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Top flap */}
    <path d="M6 9h12" stroke="currentColor" strokeWidth="1" />
    {/* Front pocket */}
    <rect x="8" y="11" width="8" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
    {/* Pocket buckle/clasp */}
    <rect x="11" y="10" width="2" height="2" rx="0.3" />
    {/* Side straps */}
    <line x1="6" y1="8" x2="4" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="18" y1="8" x2="20" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Bottom */}
    <line x1="6" y1="19" x2="6" y2="21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="18" y1="19" x2="18" y2="21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const KnotIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    className={className}
  >
    {/* Rope knot - overhand/figure-eight style */}
    <path
      d="M4 8 C6 8, 8 6, 10 6 C12 6, 12 10, 14 10 C16 10, 16 6, 14 6 C12 6, 12 10, 10 10 C8 10, 8 8, 10 8"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Left rope end */}
    <path d="M4 8 C3 9, 2 12, 3 14" strokeWidth="2" strokeLinecap="round" />
    {/* Right rope end */}
    <path d="M14 10 C16 12, 18 14, 20 15" strokeWidth="2" strokeLinecap="round" />
    {/* Rope texture lines */}
    <path d="M5.5 8.5l0.6 0.3" strokeWidth="0.6" opacity="0.4" />
    <path d="M17 12.5l0.6 0.3" strokeWidth="0.6" opacity="0.4" />
  </svg>
);

export const BadgeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Shield/badge shape */}
    <path
      d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.4 4.6-1.25 8-6.15 8-11.4V5L12 2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Inner border */}
    <path
      d="M12 4L6 6.5v4.8c0 4.2 2.7 8.1 6 9.2 3.3-1.1 6-5 6-9.2V6.5L12 4z"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      opacity="0.5"
    />
    {/* Star in center */}
    <polygon points="12,7 13.2,10.2 16.5,10.5 14,12.7 14.8,16 12,14.2 9.2,16 10,12.7 7.5,10.5 10.8,10.2" />
  </svg>
);

export const FleurDeLisIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Center petal */}
    <path d="M12 2c0 0-3.5 4.5-3.5 8 0 2.5 1.5 4 3.5 4.5 2-0.5 3.5-2 3.5-4.5 0-3.5-3.5-8-3.5-8z" />
    {/* Left petal */}
    <path d="M6 5c0 0-2.5 4-1.8 7 0.4 1.8 2 2.8 3.5 2 1-0.8 1.2-2.5 0.3-5.5C7.2 6.5 6 5 6 5z" />
    {/* Right petal */}
    <path d="M18 5c0 0 2.5 4 1.8 7-0.4 1.8-2 2.8-3.5 2-1-0.8-1.2-2.5-0.3-5.5C16.8 6.5 18 5 18 5z" />
    {/* Stem */}
    <rect x="11" y="14" width="2" height="6" rx="0.5" />
    {/* Cross band */}
    <rect x="8.5" y="16" width="7" height="1.5" rx="0.5" />
    {/* Base scrolls */}
    <path d="M8.5 20c-1.5 0.5-2.5-0.5-2-2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M15.5 20c1.5 0.5 2.5-0.5 2-2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const AxeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Handle */}
    <line x1="6" y1="20" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Axe head */}
    <path d="M14 7.5C14 7.5 16 4 19 3 C20 2.7 21 3 21 4 C21 6 18 8.5 16 9 C15 9.2 14 8.8 14 7.5z" />
    {/* Handle wrap/grip lines */}
    <line x1="7.5" y1="18" x2="8.5" y2="16.5" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    <line x1="8" y1="17" x2="9" y2="15.5" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    <line x1="8.5" y1="16" x2="9.5" y2="14.5" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

export const BinocularsIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Left barrel */}
    <rect x="3" y="7" width="7" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Right barrel */}
    <rect x="14" y="7" width="7" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Bridge connecting barrels */}
    <path d="M10 10 C11 8, 13 8, 14 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Left lens */}
    <circle cx="6.5" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="6.5" cy="16" r="1" opacity="0.3" />
    {/* Right lens */}
    <circle cx="17.5" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="17.5" cy="16" r="1" opacity="0.3" />
    {/* Eye pieces */}
    <rect x="4.5" y="6" width="4" height="2" rx="0.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
    <rect x="15.5" y="6" width="4" height="2" rx="0.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
    {/* Focus wheel */}
    <circle cx="12" cy="9" r="1.2" fill="none" stroke="currentColor" strokeWidth="0.8" />
  </svg>
);

export const ChristmasTreeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Star on top */}
    <polygon points="12,1 12.8,3.5 15,3.5 13.2,5 14,7.5 12,6 10,7.5 10.8,5 9,3.5 11.2,3.5" />
    {/* Tree layers */}
    <polygon points="12,5 8,10 16,10" />
    <polygon points="12,8 6.5,14 17.5,14" />
    <polygon points="12,12 5,19 19,19" />
    {/* Trunk */}
    <rect x="10.5" y="19" width="3" height="3" rx="0.3" />
    {/* Ornaments */}
    <circle cx="10" cy="11" r="0.8" opacity="0.5" />
    <circle cx="14.5" cy="13" r="0.8" opacity="0.5" />
    <circle cx="11" cy="15.5" r="0.8" opacity="0.5" />
    <circle cx="8.5" cy="17" r="0.7" opacity="0.5" />
    <circle cx="15" cy="16.5" r="0.7" opacity="0.5" />
  </svg>
);

export const BugleIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    {/* Mouthpiece */}
    <path d="M2 11.5 C2 11 2.5 10.5 3 10.5 L5 10.5 L5 13.5 L3 13.5 C2.5 13.5 2 13 2 12.5z" fill="none" stroke="currentColor" strokeWidth="1.3" />
    {/* Main tube */}
    <path
      d="M5 11 L8 11 C8 11 9 11 9 10 L9 8 C9 7 10 7 10 7 L14 7 C14 7 15 7 15 8 L15 10 C15 11 16 11 16 11 L16 13 C16 13 16 14 15 14 L15 16 C15 17 14 17 14 17 L10 17 C10 17 9 17 9 16 L9 14 C9 13 8 13 8 13 L5 13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    {/* Bell */}
    <path d="M16 10 C16 10 20 8 22 6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M16 14 C16 14 20 16 22 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M22 6 C23 8 23 16 22 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Sound waves */}
    <path d="M21 9 C22 10 22 14 21 15" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
    {/* Valve buttons */}
    <circle cx="11" cy="7" r="0.6" />
    <circle cx="13" cy="7" r="0.6" />
  </svg>
);
