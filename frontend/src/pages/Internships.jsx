import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function Internships() {
  const { config, updatePath, isEditMode } = useAdminEdit();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [fileName, setFileName] = useState('');

  // Fallback defaults
  const internData = config?.internships || {
    heroBadge: 'Internship Program',
    heroTitle: 'Build Your Engineering Foundation With Us',
    heroDescription: 'Gain deep engineering experience working in our technology studio and product incubator. We train future architects.',
    benefitsTitle: 'Why Join the ArivTek Cohort?',
    benefitsDescription: 'Our internship cycles are highly structured. You will undergo 2 weeks of core architectural training, followed by direct integration into our venture development teams.',
    benefits: [],
    formTitle: 'Submit Cohort Application',
    domains: []
  };

  const benefits = internData.benefits || [];
  const domains = internData.domains || [];

  const getIcon = (name) => {
    return LucideIcons[name] || LucideIcons.HelpCircle;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('college', data.college);
      formData.append('domain', data.domain);
      
      if (data.resume && data.resume[0]) {
        formData.append('resume', data.resume[0]);
      }

      const response = await fetch('/api/internship', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setStatus('success');
        setFileName('');
        reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Benefits operations
  const handleAddBenefit = () => {
    const newBenefit = {
      title: 'Practical Work Strategy',
      desc: 'Collaborate with agile frameworks, daily standups, and Git branch management.',
      iconName: 'Users'
    };
    updatePath('internships.benefits', [...benefits, newBenefit]);
  };

  const handleDeleteBenefit = (idx) => {
    const updated = benefits.filter((_, i) => i !== idx);
    updatePath('internships.benefits', updated);
  };

  // Domains operations
  const handleAddDomain = () => {
    updatePath('internships.domains', [...domains, 'New Focus Area']);
  };

  const handleDeleteDomain = (idx) => {
    const updated = domains.filter((_, i) => i !== idx);
    updatePath('internships.domains', updated);
  };

  const handleUpdateDomain = (idx, val) => {
    const updated = [...domains];
    updated[idx] = val;
    updatePath('internships.domains', updated, true);
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

      {/* Header Intro */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            <EditableText path="internships.heroBadge">{internData.heroBadge}</EditableText>
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight">
            <EditableArea path="internships.heroTitle">{internData.heroTitle}</EditableArea>
          </h1>
          <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            <EditableArea path="internships.heroDescription">{internData.heroDescription}</EditableArea>
          </div>
        </div>
      </section>

      {/* Benefits vs Form Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Benefits Column */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                <EditableText path="internships.benefitsTitle">{internData.benefitsTitle}</EditableText>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                <EditableArea path="internships.benefitsDescription">{internData.benefitsDescription}</EditableArea>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b, idx) => {
                const Icon = getIcon(b.iconName);
                return (
                  <div key={idx} className="relative group/benefit p-5 rounded-2xl bg-white/40 dark:bg-darkCard/30 border border-slate-200/50 dark:border-slate-800/50 space-y-3">
                    {isEditMode && (
                      <button
                        onClick={() => handleDeleteBenefit(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all text-xs opacity-0 group-hover/benefit:opacity-100"
                        title="Delete Benefit"
                      >
                        <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="p-2.5 rounded-xl bg-primary-55/10 dark:bg-primary-950/40 text-primary-600 dark:text-accent-400 w-fit">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      <EditableText path={`internships.benefits[${idx}].title`} skipReload>{b.title}</EditableText>
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      <EditableArea path={`internships.benefits[${idx}].desc`} skipReload>{b.desc}</EditableArea>
                    </p>
                  </div>
                );
              })}

              {isEditMode && (
                <button
                  onClick={handleAddBenefit}
                  className="p-5 border border-dashed border-slate-300 dark:border-slate-800 hover:border-primary-500 rounded-2xl text-slate-450 hover:text-primary-500 text-xs font-semibold flex flex-col items-center justify-center gap-2 min-h-[140px]"
                >
                  <LucideIcons.Plus className="w-5 h-5" />
                  <span>+ Add Benefit Card</span>
                </button>
              )}
            </div>
          </div>

          {/* Form Column */}
          <div className="p-8 sm:p-10 rounded-3xl glass-card border-primary-500/10 space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
              <EditableText path="internships.formTitle">{internData.formTitle}</EditableText>
            </h3>

            {/* Editable domains configuration dashboard for admins */}
            {isEditMode && (
              <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Manage Target Domains (Dropdown list)</span>
                  <button
                    onClick={handleAddDomain}
                    className="text-[10px] text-primary-500 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <LucideIcons.Plus className="w-3 h-3" />
                    <span>Add option</span>
                  </button>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {domains.map((d, dIdx) => (
                    <span key={dIdx} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-350 text-[10px] flex items-center gap-1">
                      <EditableText 
                        path={`internships.domains[${dIdx}]`} 
                        skipReload
                        onChange={(val) => handleUpdateDomain(dIdx, val)}
                      >
                        {d}
                      </EditableText>
                      <button
                        onClick={() => handleDeleteDomain(dIdx)}
                        className="text-rose-500 hover:text-rose-400 font-bold"
                        title="Delete Option"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start space-x-3">
                <LucideIcons.CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Application Received!</p>
                  <p className="text-xs text-emerald-500/80 mt-0.5">Our program coordinators will review your resume and email verification within 3 business days.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start space-x-3">
                <LucideIcons.AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Submission Failed</p>
                  <p className="text-xs text-rose-500/80 mt-0.5">Something went wrong during transit. Please check your file size limit or try again.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-darkBg/50 text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 text-sm transition-all"
                  placeholder="John Doe"
                />
                {errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-darkBg/50 text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 text-sm transition-all"
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-xs text-rose-500">{errors.email.message}</span>}
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    {...register('phone', { required: 'Phone is required' })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-darkBg/50 text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 text-sm transition-all"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <span className="text-xs text-rose-500">{errors.phone.message}</span>}
                </div>
              </div>

              {/* College */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">College/University</label>
                <input 
                  type="text" 
                  {...register('college', { required: 'College is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-darkBg/50 text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 text-sm transition-all"
                  placeholder="Indian Institute of Technology"
                />
                {errors.college && <span className="text-xs text-rose-500">{errors.college.message}</span>}
              </div>

              {/* Domain Select dropdown */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Target Domain</label>
                <select 
                  {...register('domain', { required: 'Please select a domain' })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-darkBg/50 text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 text-sm transition-all"
                >
                  <option value="" className="text-slate-400">Select Domain...</option>
                  {domains.map(d => (
                    <option key={d} value={d} className="text-slate-800 dark:text-slate-200">{d}</option>
                  ))}
                </select>
                {errors.domain && <span className="text-xs text-rose-500">{errors.domain.message}</span>}
              </div>

              {/* Resume upload */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Resume Upload (PDF / Doc)</label>
                <div className="relative border border-dashed border-slate-200 dark:border-slate-850 hover:border-primary-500 dark:hover:border-accent-500 rounded-xl bg-white/50 dark:bg-darkBg/50 p-4 transition-all">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    {...register('resume', { 
                      required: 'Resume file is required',
                      onChange: handleFileChange 
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1 text-slate-550">
                    <LucideIcons.CloudUpload className="w-6 h-6 text-primary-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {fileName ? `Selected: ${fileName}` : 'Click or Drag PDF here'}
                    </span>
                  </div>
                </div>
                {errors.resume && <span className="text-xs text-rose-500">{errors.resume.message}</span>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Resume...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
    </motion.div>
  );
}
