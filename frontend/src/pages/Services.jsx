import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function Services() {
  const { config, isEditMode, updatePath } = useAdminEdit();
  const serviceCategories = config.serviceCategories || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full pt-20"
    >
      {/* Background ambient lighting */}
      <div className="bg-glow-purple top-1/4 left-1/10" />
      <div className="bg-glow-blue bottom-1/4 right-1/10" />

      {/* Header section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            Our Capabilities
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight block text-slate-900 dark:text-white">
            Premium Engineering & <br />
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-300 bg-clip-text text-transparent">
              Consulting Services
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            We provide full-spectrum engineering expertise, serving as a tech strategy partner for established enterprises and a technical building studio for emerging digital products.
          </p>
        </div>
      </section>

      {/* Detailed Services list */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 relative z-10">
        {serviceCategories.map((cat, idx) => {
          const IconComponent = LucideIcons[cat.iconName] || LucideIcons.Laptop;
          return (
            <div 
              key={idx} 
              className={`p-8 lg:p-12 rounded-3xl border bg-white/40 dark:bg-darkCard/30 backdrop-blur-md flex flex-col lg:flex-row gap-8 lg:gap-12 transition-all duration-300 hover:border-primary-500/20 relative group ${cat.color || 'border-blue-500/20 shadow-blue-500/5'}`}
            >
              {isEditMode && (
                <button
                  onClick={() => {
                    const next = serviceCategories.filter((_, i) => i !== idx);
                    updatePath('serviceCategories', next);
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300 z-10"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Category Intro */}
              <div className="flex-1 text-left space-y-4 lg:max-w-md">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white w-fit shadow-lg shadow-primary-500/10">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white w-full">
                  <EditableText path={`serviceCategories[${idx}].title`}>{cat.title}</EditableText>
                </h2>
                <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed w-full">
                  <EditableArea path={`serviceCategories[${idx}].desc`}>{cat.desc}</EditableArea>
                </div>
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-400">
                  ⚡ Fully compliant with ISO & GDPR engineering standards
                </div>
              </div>

              {/* Items Breakdown list */}
              <div className="flex-1 space-y-6 text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold text-xs tracking-wider uppercase text-slate-400">Key Offerings</h3>
                  {isEditMode && (
                    <button
                      onClick={() => {
                        const nextItems = [...(cat.items || []), { name: 'New Offering', desc: 'Offering description.' }];
                        updatePath(`serviceCategories[${idx}].items`, nextItems);
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-bold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Offering</span>
                    </button>
                  )}
                </div>
                
                <div className="space-y-6 w-full">
                  {(cat.items || []).map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start space-x-3 group/item relative">
                      <div className="mt-1 p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-accent-400 group-hover/item:bg-primary-500 group-hover/item:text-white transition-all duration-200">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      
                      <div className="space-y-1 flex-grow w-full pr-8">
                        <h4 className="font-display font-semibold text-base text-slate-900 dark:text-white group-hover/item:text-primary-600 dark:group-hover/item:text-accent-400 transition-colors w-full">
                          <EditableText path={`serviceCategories[${idx}].items[${itemIdx}].name`}>{item.name}</EditableText>
                        </h4>
                        <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed w-full">
                          <EditableArea path={`serviceCategories[${idx}].items[${itemIdx}].desc`}>{item.desc}</EditableArea>
                        </div>
                      </div>

                      {isEditMode && (
                        <button
                          onClick={() => {
                            const nextItems = cat.items.filter((_, i) => i !== itemIdx);
                            updatePath(`serviceCategories[${idx}].items`, nextItems);
                          }}
                          className="absolute right-0 top-0.5 text-rose-500 hover:text-rose-600 font-bold opacity-0 group-hover/item:opacity-100 transition-opacity"
                          title="Delete Offering"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Category in Edit Mode */}
        {isEditMode && (
          <button
            onClick={() => {
              const next = [
                ...serviceCategories,
                { title: 'New Services Category', desc: 'Category description overview.', items: [], color: 'border-blue-500/20 shadow-blue-500/5', iconName: 'Laptop' }
              ];
              updatePath('serviceCategories', next);
            }}
            className="w-full p-8 rounded-3xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex flex-col items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 min-h-[150px] gap-2"
          >
            <Plus className="w-6 h-6 animate-pulse" />
            <span>Add New Services Category</span>
          </button>
        )}
      </section>

      {/* Trust Quote / CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-100/50 dark:bg-darkCard/40 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
          <h2 className="font-display font-bold text-2xl mb-4 text-slate-900 dark:text-white">Need a customized engineering strategy?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Schedule a technical brainstorming session with our Principal Architect. No sales pitches, just deep technical discussion on architecture and costs.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold text-sm transition-all hover:scale-[1.02] shadow shadow-primary-500/20"
          >
            <span>Book Tech Call</span>
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </a>
        </div>
      </section>
    </motion.div>
  );
}
