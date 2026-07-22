import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Cloud, ArrowRight, ShieldCheck, Zap, Globe, Layers, LineChart,
  ChevronLeft, ChevronRight, Quote, CheckCircle, Database, LayoutGrid, Plus, Trash2
} from 'lucide-react';
import StatsCounter from '../components/StatsCounter';
import * as LucideIcons from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function Home() {
  const { config, isEditMode, updatePath } = useAdminEdit();
  
  const company = config.company || {};
  const services = config.services || [];
  const whyChooseUs = config.whyChooseUs || [];
  const testimonials = config.testimonials || [];
  const products = config.products || [];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full pt-20"
    >
      {/* Ambient backgrounds */}
      <div className="bg-glow-purple top-1/4 left-1/10" />
      <div className="bg-glow-blue top-1/2 right-1/10" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden">
        <div className="flex-1 space-y-6 text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider"
          >
            <EditableText path="company.name" className="outline-none">
              {company.name || 'ArivTek Ecosystem'}
            </EditableText>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight block text-slate-900 dark:text-white"
          >
            <EditableText path="company.tagline">
              {company.tagline || 'Building Digital Products & Technology Solutions'}
            </EditableText>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed"
          >
            <EditableArea path="company.description">
              {company.description || 'We help businesses grow through custom software, digital transformation, automation, cloud solutions, consulting, and innovative technology products.'}
            </EditableArea>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium shadow-lg shadow-primary-500/20 flex items-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              className="px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-darkCard/40 backdrop-blur-md font-medium transition-all hover:scale-[1.02]"
            >
              Explore Products
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <div className="flex-1 w-full relative z-10 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-[450px] aspect-square rounded-3xl bg-gradient-to-tr from-primary-600/10 via-secondary-500/10 to-accent-400/10 border border-slate-200/20 dark:border-slate-800/20 relative p-8 flex items-center justify-center shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Tech grid visual element */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800e_1px,transparent_1px),linear-gradient(to_bottom,#8080800e_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Ambient glowing circles */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500/10 rounded-full filter blur-xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-accent-500/10 rounded-full filter blur-xl animate-pulse-slow" />

            {/* Orbit paths */}
            <div className="w-[80%] aspect-square rounded-full border border-dashed border-slate-300/30 dark:border-slate-700/30 absolute flex items-center justify-center animate-spin-slow">
              <div className="w-5 h-5 rounded-full bg-accent-400 absolute -top-2.5 flex items-center justify-center text-[10px] text-slate-900 font-bold shadow-md shadow-accent-400/30">C</div>
              <div className="w-5 h-5 rounded-full bg-primary-500 absolute -bottom-2.5 flex items-center justify-center text-[10px] text-white font-bold shadow-md shadow-primary-500/30">S</div>
            </div>

            <div className="w-[50%] aspect-square rounded-full border border-dashed border-slate-300/40 dark:border-slate-700/40 absolute flex items-center justify-center animate-spin-reverse">
              <div className="w-5 h-5 rounded-full bg-secondary-500 absolute -left-2.5 flex items-center justify-center text-[10px] text-white font-bold shadow-md shadow-secondary-500/30">I</div>
            </div>

            {/* Main Center Ecosystem Hub */}
            <div className="z-10 p-6 rounded-2xl glass-card text-center border-primary-500/20 max-w-[200px]">
              <Cpu className="w-10 h-10 mx-auto text-primary-500 mb-3 animate-bounce" />
              <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">Hub</h4>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-white mt-1">ArivTek Core</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCounter target="120" suffix="+" label="Projects Delivered" />
          <StatsCounter target="15" suffix="+" label="Products Built" />
          <StatsCounter target="80" suffix="+" label="Clients Served" />
          <StatsCounter target="45" suffix="+" label="Team Members" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-accent-400">Core Services</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Comprehensive Tech & Development Expertise
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            We deliver state-of-the-art software systems and digital services matching global security and speed expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((srv, index) => {
            const Icon = LucideIcons[srv.iconName] || LucideIcons.Cpu;
            return (
              <div key={index} className="p-8 rounded-2xl glass-card flex flex-col items-start text-left relative group">
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = services.filter((_, i) => i !== index);
                      updatePath('services', next);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${srv.color || 'from-blue-600 to-indigo-500'} text-white mb-6 shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3 w-full">
                  <EditableText path={`services[${index}].title`}>{srv.title}</EditableText>
                </h3>
                
                <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow w-full">
                  <EditableArea path={`services[${index}].desc`}>{srv.desc}</EditableArea>
                </div>
                
                <Link to="/services" className="inline-flex items-center text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 font-semibold text-sm group">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}

          {/* Add Service Block in Edit Mode */}
          {isEditMode && (
            <button
              onClick={() => {
                const next = [
                  ...services,
                  { iconName: 'Cpu', title: 'New Service', desc: 'Service description.', color: 'from-blue-600 to-indigo-500' }
                ];
                updatePath('services', next);
              }}
              className="p-8 rounded-2xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex flex-col items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 min-h-[250px] gap-2"
            >
              <Plus className="w-6 h-6 animate-pulse" />
              <span>Add New Service</span>
            </button>
          )}
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20 bg-slate-50/50 dark:bg-darkCard/20 px-4 sm:px-6 lg:px-8 relative z-10 border-y border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-left space-y-4 max-w-2xl">
              <h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-accent-400">Venture Incubator</h2>
              <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
                Our Digital Venture Platform
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                We believe in building and launching our own products alongside client services. Here are some of the ventures incubated within ArivTek.
              </p>
            </div>
            <Link to="/products" className="inline-flex items-center px-5 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700 hover:scale-[1.02]">
              <span>All Products</span>
              <LayoutGrid className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod, index) => {
              const isArivMart = prod.id === 'arivmart';
              return (
                <div
                  key={prod.id}
                  className={`p-8 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${isArivMart
                      ? 'bg-gradient-to-b from-primary-950/20 to-secondary-950/20 border-primary-500/30 shadow-xl dark:shadow-primary-950/20'
                      : 'glass-card'
                    }`}
                >
                  {isEditMode && (
                    <button
                      onClick={() => {
                        const next = products.filter((_, i) => i !== index);
                        updatePath('products', next);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300 z-10"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  {isArivMart && (
                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                      Highlighted Product
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <EditableText path={`products[${index}].category`}>{prod.category}</EditableText>
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${prod.status === 'Released'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : prod.status === 'Beta Testing'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-primary-500/10 text-primary-600 dark:text-accent-400 border border-primary-500/20'
                        }`}>
                        <EditableText path={`products[${index}].status`}>{prod.status}</EditableText>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white w-full">
                      <EditableText path={`products[${index}].name`}>{prod.name}</EditableText>
                    </h3>
                    <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed w-full">
                      <EditableArea path={`products[${index}].description`}>{prod.description}</EditableArea>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                    <span className="text-xs text-slate-400 italic">Target: MSMEs & SaaS</span>
                    <Link to={`/products/${prod.id}`} className="inline-flex items-center text-primary-600 dark:text-accent-400 font-semibold text-sm group">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Add Product Block in Edit Mode */}
            {isEditMode && (
              <button
                onClick={() => {
                  const next = [
                    ...products,
                    { id: `prod-${Date.now()}`, name: 'New Product', description: 'Product overview.', category: 'SaaS', status: 'In Development', features: [], tech: [] }
                  ];
                  updatePath('products', next);
                }}
                className="p-8 rounded-2xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex flex-col items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 min-h-[300px] gap-2"
              >
                <Plus className="w-6 h-6 animate-pulse" />
                <span>Add New Venture Product</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-accent-400">Why Partner Us</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Built for Scale, Engineered for Excellence
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            We deliver state-of-the-art enterprise support and quick execution, creating value through technological leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {whyChooseUs.map((wcu, idx) => {
            const Icon = LucideIcons[wcu.iconName] || LucideIcons.HelpCircle;
            return (
              <div key={idx} className="p-6 rounded-2xl glass-card text-left flex items-start space-x-4 relative group">
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = whyChooseUs.filter((_, i) => i !== idx);
                      updatePath('whyChooseUs', next);
                    }}
                    className="absolute top-3 right-3 p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300"
                    title="Delete Partner Reason"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-accent-400 shadow-inner flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="space-y-2 flex-grow">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white w-full">
                    <EditableText path={`whyChooseUs[${idx}].title`}>{wcu.title}</EditableText>
                  </h3>
                  <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed w-full">
                    <EditableArea path={`whyChooseUs[${idx}].desc`}>{wcu.desc}</EditableArea>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Choose Reason in Edit Mode */}
          {isEditMode && (
            <button
              onClick={() => {
                const next = [
                  ...whyChooseUs,
                  { title: 'New Partner Point', desc: 'Description of the value proposition.', iconName: 'CheckCircle' }
                ];
                updatePath('whyChooseUs', next);
              }}
              className="p-6 rounded-2xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex flex-col items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 min-h-[100px] gap-1"
            >
              <Plus className="w-5 h-5 animate-pulse" />
              <span>Add Partner Reason</span>
            </button>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-slate-50/50 dark:bg-darkCard/20 px-4 sm:px-6 lg:px-8 relative z-10 border-y border-slate-200/40 dark:border-slate-800/40 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative">
            {isEditMode && (
              <div className="absolute top-0 right-0 flex space-x-2 z-10">
                <button
                  onClick={() => {
                    const next = [
                      ...testimonials,
                      { quote: 'New testimonial quote goes here.', author: 'Client Name', role: 'CTO, Company' }
                    ];
                    updatePath('testimonials', next);
                    setActiveTestimonial(next.length - 1);
                  }}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[10px]"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Quote</span>
                </button>
                <button
                  onClick={() => {
                    const next = testimonials.filter((_, i) => i !== activeTestimonial);
                    updatePath('testimonials', next);
                    setActiveTestimonial(0);
                  }}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[10px]"
                  disabled={testimonials.length <= 1}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Quote</span>
                </button>
              </div>
            )}
            
            <div className="flex justify-center mb-6">
              <Quote className="w-12 h-12 text-primary-500/20" />
            </div>

            <div className="min-h-[160px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 w-full"
                >
                  <div className="font-display text-lg sm:text-xl md:text-2xl italic leading-relaxed text-slate-800 dark:text-slate-200 font-light w-full">
                    <EditableArea path={`testimonials[${activeTestimonial}].quote`}>
                      {testimonials[activeTestimonial]?.quote || ''}
                    </EditableArea>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white w-full">
                      <EditableText path={`testimonials[${activeTestimonial}].author`}>
                        {testimonials[activeTestimonial]?.author || ''}
                      </EditableText>
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs tracking-wider uppercase mt-1 w-full">
                      <EditableText path={`testimonials[${activeTestimonial}].role`}>
                        {testimonials[activeTestimonial]?.role || ''}
                      </EditableText>
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Arrows */}
            <div className="flex justify-center items-center space-x-6 mt-12">
              <button
                onClick={prevTestimonial}
                className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex space-x-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === activeTestimonial
                        ? 'bg-primary-500 w-6'
                        : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Lead Generation CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10 text-center">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-primary-900/90 via-secondary-900/90 to-darkBg/95 border border-primary-500/20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl">Ready to transform your tech?</h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Whether you are an enterprise seeking cloud modernization, or a startup founder looking for an incubator and engineering studio partner, ArivTek is ready to co-create your next milestone.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-primary-600 hover:from-cyan-600 hover:to-primary-700 text-white font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
              >
                Start a Conversation
              </Link>
              <Link
                to="/careers"
                className="px-8 py-3.5 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/10 text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              >
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
