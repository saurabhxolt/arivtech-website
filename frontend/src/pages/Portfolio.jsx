import React from 'react';
import { motion } from 'framer-motion';
import { BarChart4, Cpu, Plus, Trash2 } from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function Portfolio() {
  const { config, updatePath, isEditMode } = useAdminEdit();

  // Fallback defaults
  const portfolioData = config?.portfolio || {
    heroBadge: 'Case Studies',
    heroTitle: 'Our Proven Technical Delivery Portfolio',
    heroDescription: 'We hold ourselves accountable to direct numerical outcomes. Explore the details of our core architectural case studies.',
    caseStudies: []
  };

  const caseStudies = portfolioData.caseStudies || [];

  // Case study CRUD
  const handleAddCaseStudy = () => {
    const newStudy = {
      title: 'New Project Integration Milestone',
      client: 'Venture Client Name',
      overview: 'Summary overview of the custom systems engineering process shipped for this venture.',
      challenge: 'Explain the technical bottleneck, legacy architecture flaws, or performance issues.',
      solution: 'Explain the serverless scaling solution, database optimization, or frontend framework selection.',
      tech: ['React', 'Node.js', 'Azure'],
      results: 'State the final business outcome, cost reductions, or speed improvements.',
      stat: '50% Faster Speed'
    };
    updatePath('portfolio.caseStudies', [...caseStudies, newStudy]);
  };

  const handleDeleteCaseStudy = (idx) => {
    const updated = caseStudies.filter((_, i) => i !== idx);
    updatePath('portfolio.caseStudies', updated);
  };

  // Tech stack tag operations
  const handleAddTechTag = (studyIdx) => {
    const currentTech = caseStudies[studyIdx]?.tech || [];
    const updatedTech = [...currentTech, 'New Tech'];
    const updatedStudies = caseStudies.map((study, idx) => {
      if (idx === studyIdx) {
        return { ...study, tech: updatedTech };
      }
      return study;
    });
    updatePath('portfolio.caseStudies', updatedStudies);
  };

  const handleDeleteTechTag = (studyIdx, tagIdx) => {
    const currentTech = caseStudies[studyIdx]?.tech || [];
    const updatedTech = currentTech.filter((_, i) => i !== tagIdx);
    const updatedStudies = caseStudies.map((study, idx) => {
      if (idx === studyIdx) {
        return { ...study, tech: updatedTech };
      }
      return study;
    });
    updatePath('portfolio.caseStudies', updatedStudies);
  };

  const handleUpdateTechTag = (studyIdx, tagIdx, val) => {
    const currentTech = caseStudies[studyIdx]?.tech || [];
    const updatedTech = [...currentTech];
    updatedTech[tagIdx] = val;
    const updatedStudies = caseStudies.map((study, idx) => {
      if (idx === studyIdx) {
        return { ...study, tech: updatedTech };
      }
      return study;
    });
    updatePath('portfolio.caseStudies', updatedStudies, true);
  };

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

      {/* Hero Header */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            <EditableText path="portfolio.heroBadge">{portfolioData.heroBadge}</EditableText>
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight">
            <EditableArea path="portfolio.heroTitle">{portfolioData.heroTitle}</EditableArea>
          </h1>
          <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            <EditableArea path="portfolio.heroDescription">{portfolioData.heroDescription}</EditableArea>
          </div>
        </div>
      </section>

      {/* Case studies grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 relative z-10">
        {caseStudies.map((study, idx) => (
          <div key={idx} className="relative p-8 lg:p-12 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-darkCard/30 backdrop-blur-md flex flex-col lg:flex-row gap-8 lg:gap-12 text-left transition-all duration-300 hover:border-primary-500/20 group/study">
            
            {/* Delete button */}
            {isEditMode && (
              <button
                onClick={() => handleDeleteCaseStudy(idx)}
                className="absolute top-4 right-4 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all shadow-md z-25 opacity-0 group-hover/study:opacity-100"
                title="Delete Case Study"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Info Column */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  <EditableText path={`portfolio.caseStudies[${idx}].client`} skipReload>{study.client}</EditableText>
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
                  <EditableText path={`portfolio.caseStudies[${idx}].title`} skipReload>{study.title}</EditableText>
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                <EditableArea path={`portfolio.caseStudies[${idx}].overview`} skipReload>{study.overview}</EditableArea>
              </p>

              {/* Challenge vs Solution layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-1.5">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">The Challenge</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    <EditableArea path={`portfolio.caseStudies[${idx}].challenge`} skipReload>{study.challenge}</EditableArea>
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-primary-600 dark:text-accent-400">The Solution</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    <EditableArea path={`portfolio.caseStudies[${idx}].solution`} skipReload>{study.solution}</EditableArea>
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics & Tech stacks Column */}
            <div className="lg:max-w-xs w-full space-y-6 flex flex-col justify-between">
              {/* Highlight Metric */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white text-center shadow-lg shadow-primary-500/10">
                <BarChart4 className="w-8 h-8 mx-auto mb-2 text-white/90" />
                <h4 className="font-display font-extrabold text-2xl tracking-tight">
                  <EditableText path={`portfolio.caseStudies[${idx}].stat`} skipReload>{study.stat}</EditableText>
                </h4>
                <p className="text-white/70 text-xs uppercase font-medium tracking-wider mt-1">Validated Metric</p>
              </div>

              {/* Tech Tags Box */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-darkCard/50 border border-slate-200/60 dark:border-slate-800/60 space-y-4">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center">
                  <Cpu className="w-3.5 h-3.5 mr-1" />
                  <span>Stack Used</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(study.tech || []).map((tag, tagIdx) => (
                    <span key={tagIdx} className="relative group/tag px-2.5 py-1 rounded bg-slate-250 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                      <EditableText 
                        path={`portfolio.caseStudies[${idx}].tech[${tagIdx}]`} 
                        skipReload
                        onChange={(val) => handleUpdateTechTag(idx, tagIdx, val)}
                      >
                        {tag}
                      </EditableText>

                      {isEditMode && (
                        <button
                          onClick={() => handleDeleteTechTag(idx, tagIdx)}
                          className="text-rose-500 hover:text-rose-600 transition-colors ml-0.5"
                          title="Delete Tag"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                  
                  {isEditMode && (
                    <button
                      onClick={() => handleAddTechTag(idx)}
                      className="px-2 py-0.5 rounded border border-dashed border-slate-400 text-slate-450 hover:text-primary-500 hover:border-primary-500 text-[9px] font-bold flex items-center gap-0.5"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Tag</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}

        {isEditMode && (
          <button
            onClick={handleAddCaseStudy}
            className="w-full p-8 border border-dashed border-slate-350 dark:border-slate-850 hover:border-primary-500 text-slate-450 hover:text-primary-500 rounded-3xl font-semibold text-sm transition-all flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            <span>+ Add Case Study</span>
          </button>
        )}
      </section>
    </motion.div>
  );
}
