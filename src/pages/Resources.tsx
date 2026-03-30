import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  ChevronDown,
  CheckSquare,
  Square,
  BookMarked,
  Compass,
  FolderOpen,
} from 'lucide-react';
import SEO from '@/components/SEO';
import AnimatedSection from '@/components/AnimatedSection';
import { BackpackIcon } from '@/assets/brand/icons';
import { getResources } from '@/lib/api';
import type { Resource } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

type ResourceCategory = 'PACKING_LIST' | 'GEAR_GUIDE' | 'MERIT_BADGE' | 'GENERAL';
type CategoryFilter = 'ALL' | ResourceCategory;

function resolveResourceCategory(resource: Resource): ResourceCategory {
  const cat = (resource.category || '').toUpperCase();
  if (cat === 'PACKING_LIST' || cat === 'PACKING') return 'PACKING_LIST';
  if (cat === 'GEAR_GUIDE' || cat === 'GEAR') return 'GEAR_GUIDE';
  if (cat === 'MERIT_BADGE' || cat === 'MERIT') return 'MERIT_BADGE';
  return 'GENERAL';
}

const filterTabs: {
  value: CategoryFilter;
  label: string;
  icon: typeof BookMarked;
}[] = [
  { value: 'ALL', label: 'All Resources', icon: FolderOpen },
  { value: 'PACKING_LIST', label: 'Packing Lists', icon: CheckSquare },
  { value: 'GEAR_GUIDE', label: 'Gear Guides', icon: Compass },
  { value: 'MERIT_BADGE', label: 'Merit Badges', icon: BookMarked },
  { value: 'GENERAL', label: 'General', icon: FolderOpen },
];

const categoryIcon: Record<ResourceCategory, typeof BookMarked> = {
  PACKING_LIST: CheckSquare,
  GEAR_GUIDE: Compass,
  MERIT_BADGE: BookMarked,
  GENERAL: FolderOpen,
};

const categoryColor: Record<ResourceCategory, string> = {
  PACKING_LIST: 'text-scout-pine',
  GEAR_GUIDE: 'text-scout-campfire',
  MERIT_BADGE: 'text-scout-gold',
  GENERAL: 'text-scout-slate',
};

const categoryBg: Record<ResourceCategory, string> = {
  PACKING_LIST: 'bg-scout-pine/10',
  GEAR_GUIDE: 'bg-scout-campfire/10',
  MERIT_BADGE: 'bg-scout-gold/10',
  GENERAL: 'bg-scout-slate/10',
};

/**
 * Renders packing list content with interactive checkboxes.
 * Detects lines that look like list items and renders them as toggleable
 * checklist items.
 */
function PackingListContent({ html }: { html: string }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  // Parse HTML into lines, handling <li> elements and plain text lines
  const lines = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const items: string[] = [];
    const listItems = tempDiv.querySelectorAll('li');
    if (listItems.length > 0) {
      listItems.forEach((li) => items.push(li.textContent?.trim() || ''));
    } else {
      // Fallback: split by <br> or newlines
      const text = tempDiv.innerHTML
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/?p>/gi, '\n')
        .replace(/<[^>]*>/g, '');
      text.split('\n').forEach((line) => {
        const trimmed = line.replace(/^[-*]\s*/, '').trim();
        if (trimmed) items.push(trimmed);
      });
    }
    return items;
  }, [html]);

  const toggleItem = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (lines.length === 0) {
    return (
      <div
        className="prose prose-sm max-w-none font-body prose-headings:font-heading prose-headings:text-scout-navy prose-p:text-scout-slate prose-a:text-scout-pine"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="space-y-1.5">
      {lines.map((item, i) => {
        const isChecked = checked.has(i);
        return (
          <button
            key={i}
            onClick={() => toggleItem(i)}
            className={`flex items-start gap-3 w-full text-left p-2 rounded-lg hover:bg-scout-mist/50 transition-colors group ${
              isChecked ? 'opacity-60' : ''
            }`}
          >
            {isChecked ? (
              <CheckSquare
                size={18}
                className="text-scout-sage flex-shrink-0 mt-0.5"
              />
            ) : (
              <Square
                size={18}
                className="text-scout-slate/40 group-hover:text-scout-pine flex-shrink-0 mt-0.5 transition-colors"
              />
            )}
            <span
              className={`font-body text-sm ${
                isChecked
                  ? 'line-through text-scout-slate/50'
                  : 'text-scout-slate'
              }`}
            >
              {item}
            </span>
          </button>
        );
      })}

      <div className="pt-3 border-t border-scout-khaki/15 mt-3">
        <p className="text-xs text-scout-slate/40 font-body">
          {checked.size} of {lines.length} items checked
        </p>
      </div>
    </div>
  );
}

/**
 * Single accordion resource item.
 */
function ResourceAccordion({
  resource,
  resolvedCategory,
  isOpen,
  onToggle,
}: {
  resource: Resource;
  resolvedCategory: ResourceCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = categoryIcon[resolvedCategory];
  const color = categoryColor[resolvedCategory];
  const bg = categoryBg[resolvedCategory];
  const content = resource.content || resource.description || '';

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors ${
        isOpen
          ? 'border-scout-pine/30 shadow-md bg-white'
          : 'border-scout-khaki/20 bg-white hover:border-scout-khaki/40'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 sm:p-5 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className={`flex-shrink-0 w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}
        >
          <Icon size={18} className={color} />
        </span>

        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-base sm:text-lg font-semibold text-scout-navy group-hover:text-scout-forest transition-colors truncate">
            {resource.title}
          </h3>
          {resource.description && !isOpen && (
            <p className="text-xs text-scout-slate/60 font-body mt-0.5 truncate">
              {resource.description.replace(/<[^>]*>/g, '').slice(0, 80)}
            </p>
          )}
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-scout-slate/40"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 pt-0">
              <div className="border-t border-scout-khaki/15 pt-4">
                {content ? (
                  resolvedCategory === 'PACKING_LIST' ? (
                    <PackingListContent html={content} />
                  ) : (
                    <div
                      className="prose prose-sm max-w-none font-body
                        prose-headings:font-heading prose-headings:text-scout-navy
                        prose-p:text-scout-slate prose-p:leading-relaxed
                        prose-a:text-scout-pine prose-a:underline-offset-2 hover:prose-a:text-scout-forest
                        prose-strong:text-scout-navy
                        prose-ul:text-scout-slate prose-ol:text-scout-slate
                        prose-li:marker:text-scout-sage
                        prose-img:rounded-lg"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )
                ) : (
                  <p className="text-sm text-scout-slate/50 font-body italic">
                    No content available.
                  </p>
                )}

                {/* File / Link downloads */}
                {(resource.fileUrl || resource.linkUrl) && (
                  <div className="mt-4 pt-3 border-t border-scout-khaki/10">
                    {resource.fileUrl && (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-scout-pine hover:text-scout-forest transition-colors"
                      >
                        Download File &darr;
                      </a>
                    )}
                    {resource.linkUrl && (
                      <a
                        href={resource.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-scout-pine hover:text-scout-forest transition-colors ml-4"
                      >
                        View Resource &rarr;
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Gear Guide displayed as a card grid.
 */
function GearGuideGrid({ resources }: { resources: { resource: Resource; category: ResourceCategory }[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map(({ resource }) => {
        const isOpen = openId === resource.id;
        const content = resource.content || resource.description || '';
        return (
          <motion.div
            key={resource.id}
            layout
            className={`border rounded-xl overflow-hidden transition-colors cursor-pointer ${
              isOpen
                ? 'border-scout-campfire/30 shadow-md bg-white sm:col-span-2 lg:col-span-3'
                : 'border-scout-khaki/20 bg-white hover:border-scout-khaki/40 hover:shadow-sm'
            }`}
            onClick={() => setOpenId(isOpen ? null : resource.id)}
          >
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-scout-campfire/10 flex items-center justify-center">
                  <Compass size={20} className="text-scout-campfire" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-semibold text-scout-navy">
                    {resource.title}
                  </h3>
                  {!isOpen && content && (
                    <p className="text-xs text-scout-slate/60 font-body mt-1 line-clamp-2">
                      {content.replace(/<[^>]*>/g, '').slice(0, 100)}
                    </p>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isOpen && content && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-scout-khaki/15">
                      <div
                        className="prose prose-sm max-w-none font-body
                          prose-headings:font-heading prose-headings:text-scout-navy
                          prose-p:text-scout-slate prose-a:text-scout-pine
                          prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Resources() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(
    (searchParams.get('category') as CategoryFilter) || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const data = await getResources();
        setResources(data);
      } catch (err) {
        setError('Unable to load resources. Please try again later.');
        console.error('Failed to fetch resources:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (categoryFilter !== 'ALL') params.category = categoryFilter;
    setSearchParams(params, { replace: true });
  }, [categoryFilter, setSearchParams]);

  // Reset accordion when filter changes
  useEffect(() => {
    setOpenAccordionId(null);
  }, [categoryFilter]);

  const categorizedResources = useMemo(() => {
    return resources.map((r) => ({
      resource: r,
      category: resolveResourceCategory(r),
    }));
  }, [resources]);

  const filteredResources = useMemo(() => {
    let filtered = categorizedResources;

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.resource.title.toLowerCase().includes(q) ||
          (r.resource.content || '')
            .replace(/<[^>]*>/g, '')
            .toLowerCase()
            .includes(q) ||
          (r.resource.description || '').toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [categorizedResources, categoryFilter, searchQuery]);

  const gearGuides = filteredResources.filter(
    (r) => r.category === 'GEAR_GUIDE'
  );
  const otherResources = filteredResources.filter(
    (r) => r.category !== 'GEAR_GUIDE'
  );

  const showGearGrid =
    categoryFilter === 'GEAR_GUIDE' || categoryFilter === 'ALL';
  const showAccordion = categoryFilter !== 'GEAR_GUIDE';

  return (
    <>
      <SEO
        title="Trail Resources"
        description="Packing lists, gear guides, merit badge information, and more for Troop 42 scouts and families."
      />

      {/* Hero Banner */}
      <section className="topo-bg py-16 sm:py-20 relative overflow-hidden">
        <div className="container-wide relative z-10">
          <AnimatedSection direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BackpackIcon className="w-10 h-10 sm:w-12 sm:h-12 text-scout-gold" />
            </div>
            <h1 className="text-center font-heading text-4xl sm:text-5xl font-bold text-white">
              Trail Resources
            </h1>
            <p className="text-center text-scout-meadow/80 font-body mt-3 text-lg max-w-xl mx-auto">
              Everything you need to be prepared. Packing lists, gear guides,
              merit badge resources, and more.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="container-wide py-10 sm:py-14">
        {/* Controls */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {filterTabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setCategoryFilter(tab.value)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                      categoryFilter === tab.value
                        ? 'bg-scout-forest text-white'
                        : 'bg-scout-mist/50 text-scout-slate hover:bg-scout-mist hover:text-scout-navy'
                    }`}
                  >
                    <TabIcon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {isAdmin && (
              <Link
                to="/admin/resources/new"
                className="btn-primary text-sm gap-2"
              >
                <Plus size={16} />
                Add Resource
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-scout-slate/40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-scout-khaki/25 bg-white font-body text-sm text-scout-navy placeholder:text-scout-slate/40 focus:outline-none focus:ring-2 focus:ring-scout-pine/30 focus:border-scout-pine/40 transition-shadow"
            />
          </div>
        </AnimatedSection>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-scout-mist border-t-scout-forest" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-scout-campfire font-body text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline mt-4 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <AnimatedSection direction="up" delay={0.2}>
            {filteredResources.length === 0 ? (
              <div className="text-center py-20">
                <FolderOpen
                  size={48}
                  className="mx-auto text-scout-khaki/40 mb-4"
                  strokeWidth={1.2}
                />
                <p className="font-heading text-xl text-scout-slate/60">
                  {searchQuery
                    ? 'No resources match your search.'
                    : 'No resources available yet.'}
                </p>
                <p className="font-body text-scout-slate/40 mt-1">
                  {searchQuery
                    ? 'Try adjusting your search terms.'
                    : 'Check back soon for packing lists, guides, and more.'}
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Gear Guides as Card Grid */}
                {showGearGrid && gearGuides.length > 0 && (
                  <div>
                    {categoryFilter === 'ALL' && (
                      <h2 className="font-heading text-xl font-bold text-scout-navy mb-4 flex items-center gap-2">
                        <Compass size={20} className="text-scout-campfire" />
                        Gear Guides
                      </h2>
                    )}
                    <GearGuideGrid resources={gearGuides} />
                  </div>
                )}

                {/* Other Resources as Accordion */}
                {showAccordion && otherResources.length > 0 && (
                  <div>
                    {categoryFilter === 'ALL' && gearGuides.length > 0 && (
                      <h2 className="font-heading text-xl font-bold text-scout-navy mb-4 flex items-center gap-2">
                        <FolderOpen size={20} className="text-scout-pine" />
                        Resources
                      </h2>
                    )}
                    <div className="space-y-3">
                      {otherResources.map(({ resource, category }, i) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.3 }}
                        >
                          <ResourceAccordion
                            resource={resource}
                            resolvedCategory={category}
                            isOpen={openAccordionId === resource.id}
                            onToggle={() =>
                              setOpenAccordionId(
                                openAccordionId === resource.id
                                  ? null
                                  : resource.id
                              )
                            }
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* When filtering gear guides only, show only the grid */}
                {categoryFilter === 'GEAR_GUIDE' && gearGuides.length > 0 && null}
              </div>
            )}
          </AnimatedSection>
        )}
      </section>
    </>
  );
}
