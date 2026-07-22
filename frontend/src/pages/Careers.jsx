import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, ArrowRight, X, FileText, CheckCircle2,
  Loader2, AlertCircle, Sparkles, User, Mail, Phone, UploadCloud, Plus, Trash2
} from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

const workflowStages = [
  { step: '01', title: 'Resume Screen', desc: 'Our technical directors review your core github repos and architectural experiences.' },
  { step: '02', title: 'Coding Evaluation', desc: 'A 60-minute practical debugging and algorithmic challenge in javascript or python.' },
  { step: '03', title: 'System Design', desc: 'Discussing cache layers, load balancers, and concurrency patterns on real scales.' },
  { step: '04', title: 'Executive Review', desc: 'Aligning cultural values, salary details, and venture incubator targets.' },
  { step: '05', title: 'Offer Letter', desc: 'Onboarding and integration into the ArivTek development pipelines.' }
];

export default function Careers() {
  const { config, isEditMode, updatePath } = useAdminEdit();
  const jobsList = config.jobsList || [];
  const [selectedJob, setSelectedJob] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setStatus(null);
    setFileName('');
  };

  const closeApplyModal = () => {
    setSelectedJob(null);
    reset();
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
      formData.append('role', selectedJob.title);
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);

      if (data.resume && data.resume[0]) {
        formData.append('resume', data.resume[0]);
      }

      const response = await fetch('/api/careers', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setStatus('success');
        setFileName('');
        reset();
        setTimeout(() => {
          closeApplyModal();
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full pt-20 animate-fade-in"
    >
      <div className="bg-glow-purple top-1/4 left-1/10" />
      <div className="bg-glow-blue bottom-1/4 right-1/10" />

      {/* Header Intro */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            Careers at ArivTek
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight block text-slate-900 dark:text-white">
            Build Future Ventures <br />
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-300 bg-clip-text text-transparent">
              With Elite Developers
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            We are looking for self-motivated software developers and analysts. If you value direct outcome metrics and love shipping robust architectures, explore our open positions.
          </p>
        </div>
      </section>

      {/* Hiring Workflow Stepper */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-accent-400 flex items-center justify-center space-x-1">
            <Sparkles className="w-4 h-4 mr-1 text-primary-500" />
            <span>How We Hire</span>
          </h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            The Application Process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {workflowStages.map((stage, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-card text-left space-y-4 border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
              <span className="absolute -right-2 -bottom-2 font-display font-black text-6xl text-slate-200 dark:text-slate-800/20 pointer-events-none transition-transform group-hover:scale-[1.1]">
                {stage.step}
              </span>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">{stage.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Listings list */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10 text-left">
        <div className="space-y-6">
          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-6">Open Job Positions</h3>

          <div className="space-y-4">
            {jobsList.map((job, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500/20 relative group"
              >
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = jobsList.filter((_, i) => i !== idx);
                      updatePath('jobsList', next);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300 z-10"
                    title="Delete Job"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="space-y-2 flex-grow w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      <EditableText path={`jobsList[${idx}].team`}>{job.team}</EditableText>
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="text-xs font-semibold text-primary-600 dark:text-accent-400 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <EditableText path={`jobsList[${idx}].location`}>{job.location}</EditableText>
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white w-full">
                    <EditableText path={`jobsList[${idx}].title`}>{job.title}</EditableText>
                  </h4>
                  <div className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-2xl w-full">
                    <EditableArea path={`jobsList[${idx}].desc`}>{job.desc}</EditableArea>
                  </div>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right text-slate-500 dark:text-slate-400 text-xs space-y-1">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <EditableText path={`jobsList[${idx}].type`}>{job.type}</EditableText>
                    </p>
                    <p>Exp: <EditableText path={`jobsList[${idx}].exp`}>{job.exp}</EditableText></p>
                  </div>
                  <button
                    onClick={() => openApplyModal(job)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-xs flex items-center space-x-1.5 transition-all hover:scale-[1.02] shadow shadow-primary-500/10"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Position Block in Edit Mode */}
            {isEditMode && (
              <button
                onClick={() => {
                  const next = [
                    ...jobsList,
                    { title: 'New Position', team: 'Development', location: 'Remote', type: 'Full-time', exp: '2-4 Years', desc: 'Job responsibilities and requirements.' }
                  ];
                  updatePath('jobsList', next);
                }}
                className="w-full p-6 rounded-2xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 gap-1.5"
              >
                <Plus className="w-4 h-4 animate-pulse" />
                <span>Add New Job Position</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl glass shadow-2xl p-6 sm:p-8 relative border border-primary-500/20 text-left"
            >
              <button
                onClick={closeApplyModal}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 mb-6 pr-8">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Apply for position</span>
                <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">{selectedJob.title}</h3>
                <p className="text-slate-500 text-xs">{selectedJob.team} • {selectedJob.location}</p>
              </div>

              {status === 'success' ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">Application Sent!</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Thank you for applying. We will review your materials and contact you within 3 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>An error occurred uploading your resume. Please try again.</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkBg/40 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                      placeholder="Jane Doe"
                    />
                    {errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkBg/40 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                      placeholder="jane@example.com"
                    />
                    {errors.email && <span className="text-xs text-rose-500">{errors.email.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkBg/40 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <span className="text-xs text-rose-500">{errors.phone.message}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resume Upload (PDF / Doc)</label>
                    <div className="relative border border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-accent-500 rounded-xl bg-white/40 dark:bg-darkBg/40 p-4 transition-all">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        {...register('resume', {
                          required: 'Resume file is required',
                          onChange: handleFileChange
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1 text-slate-500">
                        <UploadCloud className="w-5 h-5 text-primary-500" />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {fileName ? `Selected: ${fileName}` : 'Click to Upload Resume (Max 10MB)'}
                        </span>
                      </div>
                    </div>
                    {errors.resume && <span className="text-xs text-rose-500">{errors.resume.message}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold text-sm shadow transition-all flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading CV...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
