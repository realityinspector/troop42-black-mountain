import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { PenLine, Megaphone, BookOpen } from 'lucide-react';
import type { Post } from '@/lib/api';

type PostCategory = 'BLOG' | 'SCOUTMASTER_NOTE' | 'ANNOUNCEMENT';

const categoryStyles: Record<
  PostCategory,
  {
    label: string;
    icon: typeof PenLine;
    color: string;
    bg: string;
    border: string;
  }
> = {
  BLOG: {
    label: 'Trail Story',
    icon: BookOpen,
    color: 'text-scout-pine',
    bg: 'bg-scout-pine/10',
    border: 'border-scout-pine/20',
  },
  SCOUTMASTER_NOTE: {
    label: "Scoutmaster's Note",
    icon: PenLine,
    color: 'text-scout-earth',
    bg: 'bg-scout-parchment',
    border: 'border-scout-khaki/40',
  },
  ANNOUNCEMENT: {
    label: 'Announcement',
    icon: Megaphone,
    color: 'text-scout-campfire',
    bg: 'bg-orange-50',
    border: 'border-scout-campfire/20',
  },
};

function resolvePostCategory(post: Post): PostCategory {
  const cat = (post.category || '').toUpperCase();
  if (cat === 'SCOUTMASTER_NOTE' || cat === 'SCOUTMASTER') return 'SCOUTMASTER_NOTE';
  if (cat === 'ANNOUNCEMENT') return 'ANNOUNCEMENT';
  return 'BLOG';
}

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const date = parseISO(post.createdAt);
  const category = resolvePostCategory(post);
  const style = categoryStyles[category];
  const Icon = style.icon;
  const isScoutmasterNote = category === 'SCOUTMASTER_NOTE';
  const featuredImage = post.featuredImage || null;
  const authorName = post.author?.name || 'Troop 42';

  return (
    <Link to={`/blog/${post.slug}`} className="block group">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`card h-full flex flex-col ${
          isScoutmasterNote ? 'ring-1 ring-scout-khaki/30' : ''
        }`}
      >
        {/* Featured Image / Default Pattern */}
        <div
          className={`relative h-44 sm:h-48 overflow-hidden ${
            isScoutmasterNote ? 'parchment-bg' : 'bg-scout-mist'
          }`}
        >
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                isScoutmasterNote ? 'parchment-bg' : 'topo-bg'
              }`}
            >
              {isScoutmasterNote ? (
                <div className="flex flex-col items-center gap-2 text-scout-earth/40">
                  <PenLine size={48} strokeWidth={1} />
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-px bg-scout-khaki/40"
                        style={{ marginTop: `${i * 6}px` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center opacity-20">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  >
                    <path d="M12 2L2 22h20L12 2z" />
                    <path d="M7 22L7 15l5-8 5 8v7" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Category Label */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-body font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.color} ${style.border} border backdrop-blur-sm`}
            >
              <Icon size={12} />
              {style.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          className={`flex-1 flex flex-col p-5 ${
            isScoutmasterNote ? 'bg-scout-parchment/30' : ''
          }`}
        >
          <h3
            className={`font-heading text-lg font-semibold leading-snug group-hover:text-scout-forest transition-colors duration-200 ${
              isScoutmasterNote ? 'text-scout-bark' : 'text-scout-navy'
            }`}
          >
            {post.title}
          </h3>

          <p className="mt-2 text-sm text-scout-slate/80 font-body line-clamp-3 flex-1">
            {post.excerpt ||
              post.content.replace(/<[^>]*>/g, '').slice(0, 160)}
          </p>

          {/* Author & Date */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-scout-slate/70 font-body">
            <span className="font-medium">{authorName}</span>
            <time dateTime={post.createdAt}>{format(date, 'MMM d, yyyy')}</time>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export { resolvePostCategory, type PostCategory };
