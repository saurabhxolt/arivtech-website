import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function StartupStudio() {
  const { config, updatePath, isEditMode } = useAdminEdit();
  const [activeStage, setActiveStage] = useState(0);

  // Fallback default config if not loaded
  const studioData = config?.startupStudio || {
    heroTitle: 'We Build, Fund, and Scale Technology Startups',
    heroTagline: 'Startup Studio & Venture Building',
    heroDescription: 'At ArivTek, we act as a parent brand and incubator. We co-found software startups by contributing expert engineering, product design, and early capital, letting operators focus entirely on growth and marketing.',
    timelineTitle: 'Our Methodology',
    timelineSubtitle: 'The Startup Incubator Lifecycle',
    timelineDescription: 'Click on any phase of the timeline below to inspect the key engineering and GTM deliverables we inject.',
    stages: [],
    alignmentBadge: 'Co-Creation Equity Model',
    alignmentTitle: 'Our Venture Building Alignment',
    alignmentDescription: 'We operate differently than service providers. We align interests by taking reduced cash fees paired with a minority equity stake in the incubated startup. This ensures our developers, designers, and systems architects are incentivized to construct robust codebases that last long-term.',
    alignmentItems: [],
    pitchTitle: 'Have a venture idea?',
    pitchDesc: 'We look for strong operational founders who understand their market niche but lack high-end engineering execution. Let\'s combine your domain insights with our codebase engine.',
    pitchButtonText: 'Submit Pitch Deck'
  };

  const stages = studioData.stages || [];
  const alignmentItems = studioData.alignmentItems || [];

  const getIcon = (name) => {
    return LucideIcons[name] || LucideIcons.HelpCircle;
  };

  // Timeline operations
  const handleAddStage = () => {
    const newStage = {
      phase: `Phase 0${stages.length + 1}`,
      title: 'New Phase Title',
      subtitle: 'New Subtitle',
      desc: 'Describe the milestone key achievements and focus areas here.',
      points: ['Deliverable A', 'Deliverable B'],
      iconName: 'Lightbulb',
      color: 'from-blue-500 to-indigo-500'
    };
    const updated = [...stages, newStage];
    updatePath('startupStudio.stages', updated);
    setActiveStage(stages.length);
  };

  const handleDeleteStage = (idx, e) => {
    e.stopPropagation();
    const updated = stages.filter((_, i) => i !== idx);
    updatePath('startupStudio.stages', updated);
    if (activeStage >= updated.length && updated.length > 0) {
      setActiveStage(updated.length - 1);
    }
  };

  // Deliverables operations for active stage
  const handleAddDeliverable = () => {
    if (!stages[activeStage]) return;
    const currentPoints = stages[activeStage].points || [];
    const updatedPoints = [...currentPoints, 'New Deliverable Item'];
    const updatedStages = stages.map((st, i) => {
      if (i === activeStage) {
        return { ...st, points: updatedPoints };
      }
      return st;
    });
    updatePath('startupStudio.stages', updatedStages);
  };

  const handleDeleteDeliverable = (ptIdx) => {
    if (!stages[activeStage]) return;
    const currentPoints = stages[activeStage].points || [];
    const updatedPoints = currentPoints.filter((_, i) => i !== ptIdx);
    const updatedStages = stages.map((st, i) => {
      if (i === activeStage) {
        return { ...st, points: updatedPoints };
      }
      return st;
    });
    updatePath('startupStudio.stages', updatedStages);
  };

  const handleUpdateDeliverable = (ptIdx, value) => {
    if (!stages[activeStage]) return;
    const currentPoints = stages[activeStage].points || [];
    const updatedPoints = [...currentPoints];
    updatedPoints[ptIdx] = value;
    const updatedStages = stages.map((st, i) => {
      if (i === activeStage) {
        return { ...st, points: updatedPoints };
      }
      return st;
    });
    updatePath('startupStudio.stages', updatedStages, true); // true to skip state reload wait
  };

  // Alignment items operations
  const handleAddAlignmentItem = () => {
    const newItem = {
      title: 'New Service Capability',
      desc: 'Brief description of continuous support or integration benefit.',
      iconName: 'CheckCircle'
    };
    updatePath('startupStudio.alignmentItems', [...alignmentItems, newItem]);
  };

  const handleDeleteAlignmentItem = (idx) => {
    const updated = alignmentItems.filter((_, i) => i !== idx);
    updatePath('startupStudio.alignmentItems', updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full pt-20"
    >
      {/* Background ambient lighting */}
      <div className="bg-glow-purple top-1/4 right-1/10" />
      <div className="bg-glow-blue bottom-1/3 left-1/10" />

      {/* Hero Intro */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            <EditableText path="startupStudio.heroTagline">{studioData.heroTagline}</EditableText>
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight">
            <EditableArea path="startupStudio.heroTitle">{studioData.heroTitle}</EditableArea>
          </h1>
          <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            <EditableArea path="startupStudio.heroDescription">{studioData.heroDescription}</EditableArea>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-accent-400">
            <EditableText path="startupStudio.timelineTitle">{studioData.timelineTitle}</EditableText>
          </h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            <EditableText path="startupStudio.timelineSubtitle">{studioData.timelineSubtitle}</EditableText>
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            <EditableText path="startupStudio.timelineDescription">{studioData.timelineDescription}</EditableText>
          </p>
        </div>

        {/* Timeline Stepper Buttons */}
        <div className="flex flex-wrap md:flex-nowrap justify-start items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 mb-12 overflow-x-auto">
          {stages.map((stage, idx) => {
            const Icon = getIcon(stage.iconName);
            const isActive = idx === activeStage;
            return (
              <div 
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`relative flex-1 min-w-[150px] p-4 rounded-xl flex flex-col items-center gap-2 text-center cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'bg-slate-100 dark:bg-slate-800 border-b-2 border-primary-500 scale-[1.02]' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-400'
                }`}
              >
                {/* Delete button */}
                {isEditMode && stages.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteStage(idx, e)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-rose-600 transition-colors z-20 shadow-md"
                    title="Delete Phase"
                  >
                    ×
                  </button>
                )}

                <div className={`p-2 rounded-lg bg-gradient-to-tr ${stage.color || 'from-primary-600 to-indigo-500'} text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <EditableText path={`startupStudio.stages[${idx}].phase`} skipReload>{stage.phase}</EditableText>
                </span>
                
                <span className={`text-xs font-bold tracking-tight ${isActive ? 'text-primary-600 dark:text-accent-400' : 'text-slate-600 dark:text-slate-350'}`}>
                  <EditableText path={`startupStudio.stages[${idx}].title`} skipReload>{stage.title}</EditableText>
                </span>
              </div>
            );
          })}

          {isEditMode && (
            <button
              onClick={handleAddStage}
              className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-primary-500 text-slate-450 hover:text-primary-500 text-xs font-semibold flex flex-col items-center justify-center gap-2 min-w-[150px]"
            >
              <LucideIcons.Plus className="w-5 h-5" />
              <span>+ Add Phase</span>
            </button>
          )}
        </div>

        {/* Phase Details Cards */}
        {stages[activeStage] && (
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12 rounded-3xl glass-card border-primary-500/10 text-left"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      {stages[activeStage].phase} — <EditableText path={`startupStudio.stages[${activeStage}].subtitle`} skipReload>{stages[activeStage].subtitle}</EditableText>
                    </span>
                    <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                      <EditableText path={`startupStudio.stages[${activeStage}].title`} skipReload>{stages[activeStage].title}</EditableText>
                    </h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    <EditableArea path={`startupStudio.stages[${activeStage}].desc`} skipReload>{stages[activeStage].desc}</EditableArea>
                  </p>
                  <div className="pt-4">
                    <a href="/contact" className="inline-flex items-center text-primary-600 dark:text-accent-400 font-semibold text-sm group">
                      <span>Pitch your idea to our Studio</span>
                      <LucideIcons.ArrowUpRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-darkCard/40 border border-slate-200/50 dark:border-slate-800/50 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-bold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-4">Phase Deliverables</h4>
                    <ul className="space-y-3">
                      {(stages[activeStage].points || []).map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-center justify-between text-slate-650 dark:text-slate-300 text-sm group/pt">
                          <div className="flex items-center space-x-2.5 flex-grow">
                            <LucideIcons.CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="flex-grow">
                              <EditableText 
                                path={`startupStudio.stages[${activeStage}].points[${pIdx}]`} 
                                skipReload
                                onChange={(val) => handleUpdateDeliverable(pIdx, val)}
                              >
                                {pt}
                              </EditableText>
                            </span>
                          </div>
                          
                          {isEditMode && (
                            <button
                              onClick={() => handleDeleteDeliverable(pIdx)}
                              className="ml-2 p-0.5 rounded text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover/pt:opacity-100 transition-all text-xs"
                              title="Delete Deliverable"
                            >
                              <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isEditMode && (
                    <button
                      onClick={handleAddDeliverable}
                      className="mt-4 w-full py-2 border border-dashed border-slate-300 dark:border-slate-800 hover:border-primary-500 rounded-xl text-slate-500 hover:text-primary-500 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <LucideIcons.Plus className="w-3.5 h-3.5" />
                      <span>+ Add Deliverable</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Startup Studio Model */}
      <section className="py-20 bg-slate-50/50 dark:bg-darkCard/20 px-4 sm:px-6 lg:px-8 relative z-10 border-y border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-secondary-500/30 bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 text-xs font-semibold uppercase tracking-wider">
              <EditableText path="startupStudio.alignmentBadge">{studioData.alignmentBadge}</EditableText>
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
              <EditableText path="startupStudio.alignmentTitle">{studioData.alignmentTitle}</EditableText>
            </h2>
            <p className="text-slate-550 dark:text-slate-400 text-sm leading-relaxed">
              <EditableArea path="startupStudio.alignmentDescription">{studioData.alignmentDescription}</EditableArea>
            </p>
            
            <div className="space-y-4 pt-2">
              {alignmentItems.map((item, idx) => {
                const Icon = getIcon(item.iconName);
                return (
                  <div key={idx} className="flex items-start space-x-3 group/align relative">
                    {isEditMode && (
                      <button
                        onClick={() => handleDeleteAlignmentItem(idx)}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 p-1 rounded text-rose-500 hover:bg-rose-500/10 transition-all text-xs"
                        title="Delete Alignment Item"
                      >
                        <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="p-1 rounded bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-accent-400 mt-1">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                        <EditableText path={`startupStudio.alignmentItems[${idx}].title`}>{item.title}</EditableText>
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                        <EditableArea path={`startupStudio.alignmentItems[${idx}].desc`}>{item.desc}</EditableArea>
                      </p>
                    </div>
                  </div>
                );
              })}

              {isEditMode && (
                <button
                  onClick={handleAddAlignmentItem}
                  className="py-2 px-4 border border-dashed border-slate-300 dark:border-slate-800 hover:border-primary-500 rounded-xl text-slate-500 hover:text-primary-500 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <LucideIcons.Plus className="w-3.5 h-3.5" />
                  <span>+ Add Alignment Point</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-900 to-secondary-900 text-white relative overflow-hidden border border-primary-500/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <h3 className="font-display font-bold text-2xl mb-4">
              <EditableText path="startupStudio.pitchTitle">{studioData.pitchTitle}</EditableText>
            </h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              <EditableArea path="startupStudio.pitchDesc">{studioData.pitchDesc}</EditableArea>
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <span>
                <EditableText path="startupStudio.pitchButtonText">{studioData.pitchButtonText}</EditableText>
              </span>
              <LucideIcons.ArrowUpRight className="w-4 h-4 ml-2 text-slate-900" />
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
