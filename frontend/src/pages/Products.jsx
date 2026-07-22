import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

export default function Products() {
  const { config, isEditMode, updatePath } = useAdminEdit();
  const products = config.products || [];
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full pt-20"
    >
      {/* Glow backgrounds */}
      <div className="bg-glow-purple top-1/4 right-1/10" />
      <div className="bg-glow-blue bottom-1/4 left-1/10" />

      {/* Hero Header */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            Venture Portfolio
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight block text-slate-900 dark:text-white">
            Our Proprietary <br />
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-300 bg-clip-text text-transparent">
              Software Ventures
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            The long-term vision of ArivTek is to build multiple successful technology ventures. Explore the digital products incubated, launched, or in development within our software ecosystem.
          </p>
        </div>
      </section>

      {/* Filters and Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${activeCategory === cat
                  ? 'bg-primary-600 border-primary-600 text-white shadow shadow-primary-500/20'
                  : 'bg-white dark:bg-darkCard/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => {
            // Find global index of this product in the config.products array for edit paths
            const globalIndex = products.findIndex(p => p.id === prod.id);
            const isArivMart = prod.id === 'arivmart';
            
            return (
              <div
                key={prod.id}
                className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${isArivMart
                    ? 'bg-gradient-to-b from-primary-950/20 to-secondary-950/20 border-primary-500/35 shadow-xl dark:shadow-primary-950/30'
                    : 'glass-card'
                  }`}
              >
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = products.filter(p => p.id !== prod.id);
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
                    Highlighted Venture
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-full">
                      <EditableText path={`products[${globalIndex}].category`}>{prod.category}</EditableText>
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${prod.status === 'Released'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : prod.status === 'Beta Testing'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-primary-500/10 text-primary-600 dark:text-accent-400 border border-primary-500/20'
                      }`}>
                      <EditableText path={`products[${globalIndex}].status`}>{prod.status}</EditableText>
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white w-full animate-fade-in">
                    <EditableText path={`products[${globalIndex}].name`}>{prod.name}</EditableText>
                  </h3>
                  <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed w-full">
                    <EditableArea path={`products[${globalIndex}].description`}>{prod.description}</EditableArea>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                  <span className="text-xs text-slate-400 italic">Target: MSMEs & SaaS</span>
                  <Link to={`/products/${prod.id}`} className="inline-flex items-center text-primary-600 dark:text-accent-400 font-semibold text-sm group">
                    <span>Learn More</span>
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
              className="p-8 rounded-3xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex flex-col items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 min-h-[250px] gap-2"
            >
              <Plus className="w-6 h-6 animate-pulse" />
              <span>Add New Venture Product</span>
            </button>
          )}
        </div>
      </section>
    </motion.div>
  );
}
