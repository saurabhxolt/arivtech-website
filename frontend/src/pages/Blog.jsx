import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, User, ArrowLeft, ArrowRight, X, Clock, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function Blog() {
  const { config, isEditMode, updatePath } = useAdminEdit();
  const articles = config.blogArticles || [];
  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const [activeCategory, setActiveCategory] = useState('All');
  const [readingArticle, setReadingArticle] = useState(null);

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(art => art.category === activeCategory);

  // If active article was modified, we should reflect the latest state inside the modal too
  const currentReadingArticle = readingArticle 
    ? articles.find(a => a.id === readingArticle.id) 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full pt-20"
    >
      <div className="bg-glow-purple top-1/4 right-1/10" />
      <div className="bg-glow-blue bottom-1/4 left-1/10" />

      {/* Header Intro */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            ArivTek Insights
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight block text-slate-900 dark:text-white">
            Engineering & Startup <br />
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-300 bg-clip-text text-transparent">
              Knowledge Hub
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Read detailed engineering walkthroughs, cost optimization case analyses, and GTM validation tips curated by our systems architects.
          </p>
        </div>
      </section>

      {/* Filters and Articles Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${(activeCategory === cat || (cat === 'All' && activeCategory === 'All'))
                  ? 'bg-primary-600 border-primary-600 text-white shadow shadow-primary-500/20'
                  : 'bg-white dark:bg-darkCard/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {filteredArticles.map((art) => {
            const globalIndex = articles.findIndex(a => a.id === art.id);
            return (
              <div key={art.id} className="p-8 rounded-2xl glass-card flex flex-col justify-between text-left border-slate-200/50 dark:border-slate-800/50 relative group">
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = articles.filter(a => a.id !== art.id);
                      updatePath('blogArticles', next);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300 z-10"
                    title="Delete Article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="px-2.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-accent-400 font-semibold uppercase tracking-wider">
                      <EditableText path={`blogArticles[${globalIndex}].category`}>{art.category}</EditableText>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <EditableText path={`blogArticles[${globalIndex}].readTime`}>{art.readTime}</EditableText>
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white leading-snug hover:text-primary-600 dark:hover:text-accent-400 transition-colors w-full">
                    <EditableText path={`blogArticles[${globalIndex}].title`}>{art.title}</EditableText>
                  </h3>
                  <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed w-full">
                    <EditableArea path={`blogArticles[${globalIndex}].excerpt`}>{art.excerpt}</EditableArea>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>By <EditableText path={`blogArticles[${globalIndex}].author`}>{art.author}</EditableText></span>
                    <span>•</span>
                    <span><EditableText path={`blogArticles[${globalIndex}].date`}>{art.date}</EditableText></span>
                  </div>
                  <button
                    onClick={() => setReadingArticle(art)}
                    className="inline-flex items-center text-primary-600 dark:text-accent-400 font-semibold text-sm group hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Article Block in Edit Mode */}
          {isEditMode && (
            <button
              onClick={() => {
                const next = [
                  ...articles,
                  { id: Date.now(), title: 'New Article', excerpt: 'Brief article introduction.', content: 'Write content here.', category: 'Technology', author: 'Author Name', date: 'July 21, 2026', readTime: '5 min read' }
                ];
                updatePath('blogArticles', next);
              }}
              className="p-8 rounded-2xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex flex-col items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 min-h-[200px] gap-2"
            >
              <Plus className="w-6 h-6 animate-pulse" />
              <span>Add New Article</span>
            </button>
          )}
        </div>
      </section>

      {/* Reader Modal Simulation */}
      <AnimatePresence>
        {currentReadingArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-sm p-4 sm:p-6 lg:p-12 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl rounded-3xl glass shadow-2xl p-6 sm:p-10 relative border border-primary-500/20 text-left my-8"
            >
              <button
                onClick={() => setReadingArticle(null)}
                className="absolute top-4 right-4 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                aria-label="Close reader"
              >
                <X className="w-5 h-5" />
              </button>

              {(() => {
                const modalGlobalIndex = articles.findIndex(a => a.id === currentReadingArticle.id);
                return (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span className="px-2.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-accent-400 font-semibold uppercase tracking-wider">
                          <EditableText path={`blogArticles[${modalGlobalIndex}].category`}>{currentReadingArticle.category}</EditableText>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <EditableText path={`blogArticles[${modalGlobalIndex}].readTime`}>{currentReadingArticle.readTime}</EditableText>
                        </span>
                      </div>
                      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight w-full">
                        <EditableText path={`blogArticles[${modalGlobalIndex}].title`}>{currentReadingArticle.title}</EditableText>
                      </h1>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
                        <User className="w-4 h-4" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          By <EditableText path={`blogArticles[${modalGlobalIndex}].author`}>{currentReadingArticle.author}</EditableText>
                        </span>
                        <span>•</span>
                        <span>
                          <EditableText path={`blogArticles[${modalGlobalIndex}].date`}>{currentReadingArticle.date}</EditableText>
                        </span>
                      </div>
                    </div>

                    <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap border-t border-slate-200/50 dark:border-slate-800/50 pt-6 w-full">
                      <EditableArea path={`blogArticles[${modalGlobalIndex}].content`}>
                        {currentReadingArticle.content}
                      </EditableArea>
                    </div>

                    <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-xs text-slate-400">
                      <span>© ArivTek LLP Knowledge Hub</span>
                      <button
                        onClick={() => setReadingArticle(null)}
                        className="inline-flex items-center space-x-1.5 text-primary-600 dark:text-accent-400 font-bold"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Blog list</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
