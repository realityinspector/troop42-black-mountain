import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, ChevronDown, ChevronUp, RefreshCw, ArrowDownToLine, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateAI } from '@/lib/api';

interface AIContentGeneratorProps {
  onInsert: (html: string) => void;
  type?: string;
}

const QUICK_PROMPTS: Record<string, { label: string; prompt: string }[]> = {
  blog_post: [
    { label: 'Write a blog post about...', prompt: 'Write a blog post about ' },
    { label: 'Scoutmaster\'s note about...', prompt: 'Write a scoutmaster\'s note about ' },
    { label: 'Recap a recent outing...', prompt: 'Write a recap of a recent scout outing to ' },
    { label: 'Spotlight a scout...', prompt: 'Write a scout spotlight article highlighting ' },
  ],
  event_description: [
    { label: 'Describe a campout at...', prompt: 'Describe a scout campout at ' },
    { label: 'Create a packing list for...', prompt: 'Create a detailed packing list for a ' },
    { label: 'Meeting agenda about...', prompt: 'Write a troop meeting agenda for a session about ' },
    { label: 'Service project details...', prompt: 'Describe a community service project involving ' },
  ],
  default: [
    { label: 'Write a blog post about...', prompt: 'Write a blog post about ' },
    { label: 'Describe a campout at...', prompt: 'Describe a scout campout at ' },
    { label: 'Create a packing list for...', prompt: 'Create a detailed packing list for a ' },
    { label: 'Scoutmaster\'s note about...', prompt: 'Write a scoutmaster\'s note about ' },
  ],
};

export default function AIContentGenerator({ onInsert, type = 'default' }: AIContentGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = QUICK_PROMPTS[type] || QUICK_PROMPTS.default;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first.');
      return;
    }
    setLoading(true);
    setGeneratedContent('');
    try {
      const result = await generateAI({ prompt: prompt.trim(), type });
      setGeneratedContent(result.content);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate content.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleInsert = () => {
    if (generatedContent) {
      onInsert(generatedContent);
      toast.success('Content inserted into editor.');
      setGeneratedContent('');
      setPrompt('');
    }
  };

  return (
    <div className="border border-scout-khaki/40 rounded-lg overflow-hidden bg-gradient-to-br from-scout-parchment to-white">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-scout-khaki/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-scout-gold to-scout-amber flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-body font-semibold text-scout-navy text-sm">AI Content Assistant</span>
          <span className="text-[10px] font-body bg-scout-gold/20 text-scout-earth px-1.5 py-0.5 rounded-full">
            Beta
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-scout-slate" />
        ) : (
          <ChevronDown className="w-4 h-4 text-scout-slate" />
        )}
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
            <div className="px-4 pb-4 space-y-4 border-t border-scout-khaki/20">
              {/* Quick Prompts */}
              <div className="pt-3">
                <p className="text-xs font-body font-semibold text-scout-slate mb-2">Quick Prompts</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((qp) => (
                    <button
                      key={qp.label}
                      type="button"
                      onClick={() => setPrompt(qp.prompt)}
                      className="text-xs font-body px-2.5 py-1.5 bg-white border border-scout-khaki/40 rounded-full text-scout-navy hover:border-scout-gold hover:bg-scout-gold/5 transition-colors"
                    >
                      <Wand2 className="inline w-3 h-3 mr-1 -mt-0.5 text-scout-gold" />
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-body font-semibold text-scout-slate mb-1.5">
                  Your Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you'd like the AI to write..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-scout-khaki/50 rounded-lg text-sm font-body text-scout-navy placeholder:text-scout-sky/60 focus:outline-none focus:ring-2 focus:ring-scout-gold focus:border-transparent transition resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-scout-gold to-scout-amber text-white font-body font-semibold text-sm rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Content
                  </>
                )}
              </button>

              {/* Loading Animation */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-4 bg-scout-gold/5 rounded-lg"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 rounded-full bg-scout-gold"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-body text-scout-earth">Crafting your content...</span>
                </motion.div>
              )}

              {/* Generated Content Preview */}
              {generatedContent && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-xs font-body font-semibold text-scout-slate">Preview</p>
                  <div
                    className="p-4 bg-white rounded-lg border border-scout-khaki/30 max-h-64 overflow-y-auto prose prose-sm font-body text-scout-navy"
                    dangerouslySetInnerHTML={{ __html: generatedContent }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleInsert}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-scout-forest text-white font-body font-semibold text-sm rounded-lg hover:bg-scout-pine transition-colors"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      Insert into Editor
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-scout-khaki/50 text-scout-navy font-body font-semibold text-sm rounded-lg hover:bg-scout-khaki/10 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
