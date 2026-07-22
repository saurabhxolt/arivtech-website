import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Cpu, BarChart3, AppWindow, Shield, Plus, Trash2 } from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function ProductDetail() {
  const { config, isEditMode, updatePath } = useAdminEdit();
  const { id } = useParams();
  
  const productsList = config.products || [];
  const product = productsList.find((p) => p.id === id);
  const globalIndex = productsList.findIndex((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20 text-center">
        <h2 className="font-display font-extrabold text-3xl mb-4">Product Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md">The product venture you are looking for does not exist in our incubator list or has been archived.</p>
        <Link to="/products" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold">
          Back to Products
        </Link>
      </div>
    );
  }

  const features = product.features || [];
  const tech = product.tech || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full pt-20"
    >
      <div className="bg-glow-purple top-1/4 left-1/10" />
      <div className="bg-glow-blue top-1/2 right-1/10" />

      {/* Header breadcrumb */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <Link to="/products" className="inline-flex items-center space-x-2 text-slate-500 hover:text-primary-600 dark:hover:text-accent-400 font-semibold text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Products</span>
        </Link>
      </section>

      {/* Detail Showcase */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
                  <EditableText path={`products[${globalIndex}].category`}>{product.category}</EditableText>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.status === 'Released'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : product.status === 'Beta Testing'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-primary-500/10 text-primary-600 dark:text-accent-400 border border-primary-500/20'
                  }`}>
                  <EditableText path={`products[${globalIndex}].status`}>{product.status}</EditableText>
                </span>
              </div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white leading-tight w-full">
                <EditableText path={`products[${globalIndex}].name`}>{product.name}</EditableText>
              </h1>
              <div className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed pt-2 w-full">
                <EditableArea path={`products[${globalIndex}].detailedDescription`}>
                  {product.detailedDescription}
                </EditableArea>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-4 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Core Capabilities & Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-darkCard/30 border border-slate-200/60 dark:border-slate-800/60 flex items-start space-x-3 relative group">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium flex-grow pr-4">
                      <EditableText path={`products[${globalIndex}].features[${idx}]`}>{feature}</EditableText>
                    </span>
                    {isEditMode && (
                      <button
                        onClick={() => {
                          const next = features.filter((_, i) => i !== idx);
                          updatePath(`products[${globalIndex}].features`, next);
                        }}
                        className="absolute right-3 top-3 text-rose-500 hover:text-rose-600 font-bold"
                        title="Delete Feature"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = [...features, 'New Product Capability'];
                      updatePath(`products[${globalIndex}].features`, next);
                    }}
                    className="p-4 rounded-xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 gap-1.5"
                  >
                    <Plus className="w-4 h-4 animate-pulse" />
                    <span>Add Feature</span>
                  </button>
                )}
              </div>
            </div>

            {/* Results / Performance metrics */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-950/20 to-secondary-950/20 border border-primary-500/25 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3.5 rounded-xl bg-primary-500/10 text-primary-500">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div className="space-y-1 flex-grow">
                <h4 className="font-display font-bold text-sm tracking-wider uppercase text-primary-600 dark:text-accent-400">Validated Impact Metrics</h4>
                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed w-full">
                  <EditableArea path={`products[${globalIndex}].results`}>
                    {product.results}
                  </EditableArea>
                </div>
              </div>
            </div>
          </div>

          {/* Tech and GTM Column */}
          <div className="space-y-8">
            {/* Tech Stack Box */}
            <div className="p-8 rounded-3xl glass-card border-slate-200/50 dark:border-slate-800/50 space-y-6">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Cpu className="w-5 h-5 text-primary-500" />
                <h3 className="font-display font-bold text-lg">Technology Stack</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Our developers used standard modern architectures to engineer high availability parameters for this project.
              </p>
              <div className="flex flex-wrap gap-2">
                {tech.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-semibold inline-flex items-center space-x-1.5">
                    <EditableText path={`products[${globalIndex}].tech[${idx}]`}>{tag}</EditableText>
                    {isEditMode && (
                      <button
                        onClick={() => {
                          const next = tech.filter((_, i) => i !== idx);
                          updatePath(`products[${globalIndex}].tech`, next);
                        }}
                        className="text-rose-500 hover:text-rose-600 font-bold ml-1"
                        title="Delete Tech Tag"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = [...tech, 'React'];
                      updatePath(`products[${globalIndex}].tech`, next);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-dashed border-primary-500/30 text-primary-500 hover:border-primary-500 hover:bg-primary-500/5 text-xs font-semibold flex items-center justify-center cursor-pointer gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 animate-pulse" />
                    <span>Add Tag</span>
                  </button>
                )}
              </div>
            </div>

            {/* Demo Request Sidebar Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-900 to-secondary-900 text-white space-y-6 border border-primary-500/20">
              <h3 className="font-display font-bold text-xl">Interested in {product.name}?</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Connect with our partnership directors to request a full technical walkthrough, sandbox tokens, or integrations consulting.
              </p>
              <Link
                to="/contact"
                className="block w-full py-3 text-center bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl transition-all hover:scale-[1.02] shadow"
              >
                Request Product Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
