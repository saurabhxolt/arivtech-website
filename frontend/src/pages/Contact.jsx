import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, ShieldCheck, MapPin, Info, 
  CheckCircle2, AlertCircle, Loader2, Compass 
} from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function Contact() {
  const { config, updatePath } = useAdminEdit();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const onSubmit = async (data) => {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setStatus('success');
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

  // Fallbacks
  const company = config?.company || {
    email: 'contact@arivtek.com',
    phone: '+91 80 4930 2000'
  };

  const contactData = config?.contactInfo || {
    heroBadge: 'Contact Us',
    heroTitle: 'Start Your Technical Brainstorming Today',
    heroDescription: 'Have a project or venture idea? Connect with our partnership directors to explore custom development, cloud strategy, or startup studio co-building.',
    subTitle: 'Corporate Headquarters',
    description: 'ArivTek LLP is registered in Karnataka, India, operating out of Bangalore\'s prime technology corridors. Feel free to reach out via phone or email for scheduling on-site visits.',
    cin: 'U72900KA2026LLP123456',
    gst: '29AAFCA1234F1Z5',
    mapLat: '12.9141° N',
    mapLng: '77.6413° E',
    mapAddress: '3rd Floor, Tech Incubator Building, Sector 4, HSR Layout, Bengaluru, Karnataka 560102',
    mapTitle: 'ArivTek Workspace'
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

      {/* Header Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            <EditableText path="contactInfo.heroBadge">{contactData.heroBadge}</EditableText>
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight">
            <EditableArea path="contactInfo.heroTitle">{contactData.heroTitle}</EditableArea>
          </h1>
          <div className="text-slate-650 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            <EditableArea path="contactInfo.heroDescription">{contactData.heroDescription}</EditableArea>
          </div>
        </div>
      </section>

      {/* Details vs Form Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Details & Map Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                <EditableText path="contactInfo.subTitle">{contactData.subTitle}</EditableText>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                <EditableArea path="contactInfo.description">{contactData.description}</EditableArea>
              </p>
            </div>

            {/* Corporate Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* LLP Details */}
              <div className="p-5 rounded-2xl bg-white/40 dark:bg-darkCard/30 border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                  <span>LLP Registration</span>
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">Name:</span> ArivTek LLP
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-350">CIN:</span>{' '}
                    <EditableText path="contactInfo.cin" skipReload>{contactData.cin}</EditableText>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-355">GST:</span>{' '}
                    <EditableText path="contactInfo.gst" skipReload>{contactData.gst}</EditableText>
                  </p>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="p-5 rounded-2xl bg-white/40 dark:bg-darkCard/30 border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center">
                  <Compass className="w-3.5 h-3.5 mr-1.5 text-secondary-500" />
                  <span>Channels</span>
                </h4>
                <div className="text-xs text-slate-550 dark:text-slate-400 space-y-1">
                  <p className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <EditableText path="company.email">{company.email}</EditableText>
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <EditableText path="company.phone">{company.phone}</EditableText>
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>Bangalore, Karnataka</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Stylized Google Maps Placeholder */}
            <div className="h-64 rounded-3xl bg-slate-100 dark:bg-darkCard/50 border border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center group">
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              <div className="absolute w-36 h-36 bg-primary-500/10 rounded-full filter blur-xl animate-pulse" />
              
              {/* Address Details */}
              <div className="relative z-10 space-y-2">
                <div className="p-3 rounded-full bg-primary-500 text-white w-fit mx-auto shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
                  <MapPin className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="font-display font-bold text-slate-800 dark:text-white text-sm mt-2">
                  <EditableText path="contactInfo.mapTitle" skipReload>{contactData.mapTitle}</EditableText>
                </h4>
                <p className="text-slate-650 dark:text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                  <EditableArea path="contactInfo.mapAddress" skipReload>{contactData.mapAddress}</EditableArea>
                </p>
                <div className="pt-2 text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex justify-center space-x-1">
                  <span>📌 Latitude:</span>
                  <EditableText path="contactInfo.mapLat" skipReload>{contactData.mapLat}</EditableText>
                  <span>, Longitude:</span>
                  <EditableText path="contactInfo.mapLng" skipReload>{contactData.mapLng}</EditableText>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="p-8 sm:p-10 rounded-3xl glass-card border-primary-500/10">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">Send a Message</h3>
            
            {status === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start space-x-3 mb-6">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Message Transmitted!</p>
                  <p className="text-xs text-emerald-500/80 mt-0.5">Your lead packet has been recorded. Our partnership manager will reach out within 24 business hours.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start space-x-3 mb-6">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Transmission Failed</p>
                  <p className="text-xs text-rose-500/80 mt-0.5">Please check your connectivity or check input validation parameters and try again.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkBg/40 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkBg/40 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                    placeholder="john@arivtek.com"
                  />
                  {errors.email && <span className="text-xs text-rose-500">{errors.email.message}</span>}
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    {...register('phone', { required: 'Phone is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkBg/40 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <span className="text-xs text-rose-500">{errors.phone.message}</span>}
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Company / Venture Name</label>
                <input 
                  type="text" 
                  {...register('company')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkBg/40 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="Enterprise Inc."
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-555 dark:text-slate-400 uppercase tracking-wider">Project / Inquiry Message</label>
                <textarea 
                  rows={4}
                  {...register('message', { required: 'Message is required' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-darkBg/40 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="Outline your project requirements, timeline limits, or investment specs..."
                />
                {errors.message && <span className="text-xs text-rose-500">{errors.message.message}</span>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold text-sm shadow transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
    </motion.div>
  );
}
