import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Eye, Map, Users, Plus, Trash2, Camera } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAdminEdit } from '../context/AdminEditContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { EditableText, EditableArea } from '../components/admin/Editable';

const getCropStyle = (avatarUrl) => {
  const baseStyle = { objectPosition: 'center 20%' };
  if (!avatarUrl) return baseStyle;
  try {
    const hash = avatarUrl.split('#')[1];
    if (!hash) return baseStyle;
    const params = new URLSearchParams(hash);
    const scale = params.get('scale') || '1';
    const x = params.get('x') || '0';
    const y = params.get('y') || '0';
    return {
      transform: `scale(${scale}) translate(${x}%, ${y}%)`,
      transformOrigin: 'center center',
      objectPosition: 'center 20%'
    };
  } catch {
    return baseStyle;
  }
};

const getCleanUrl = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.trim() === '') {
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
  }
  return avatarUrl.split('#')[0];
};

export default function About() {
  const { config, isEditMode, updatePath } = useAdminEdit();
  const { token } = useAdminAuth();
  const fileInputRef = useRef(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // Cropper states
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropFile, setCropFile] = useState(null);
  const [cropScale, setCropScale] = useState(1.2);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || uploadingIndex === null) return;

    // Check for unsupported HEIC/HEIF Apple formats
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'heic' || ext === 'heif') {
      alert("HEIC/HEIF images (Apple format) are not natively supported by web browsers. Please select a standard image format (JPG, PNG, WebP, or SVG) or convert your HEIC image to JPEG first.");
      setUploadingIndex(null);
      e.target.value = '';
      return;
    }

    setCropFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropScale(1.2);
      setCropX(0);
      setCropY(0);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropSave = async () => {
    if (!cropFile || uploadingIndex === null) return;
    
    const idx = uploadingIndex;
    setCropImageSrc(null);
    setCropFile(null);

    const formData = new FormData();
    formData.append('image', cropFile);

    try {
      const res = await fetch('/api/mgmt/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const finalUrl = `${data.imageUrl}#scale=${cropScale}&x=${cropX}&y=${cropY}`;
        updatePath(`leaders[${idx}].avatar`, finalUrl);
      } else {
        const err = await res.json();
        alert(`Upload failed: ${err.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error during upload: ${err.message}`);
    } finally {
      setUploadingIndex(null);
    }
  };
  
  const company = config?.company || {
    tagline: 'Building the Next Era of Digital Ventures',
    description: 'ArivTek LLP was established to bridge the gap between premium enterprise consulting and the agile product building of a startup. Under a single parent ecosystem, we act as both a technical execution studio for corporate clients and an active builder of tech ventures.'
  };

  const values = config.values || [];
  const leaders = config.leaders || [];
  const roadmap = config.roadmap || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full pt-20"
    >
      {/* Background glow */}
      <div className="bg-glow-purple top-1/4 right-1/10" />
      <div className="bg-glow-blue top-3/4 left-1/10" />

      {/* Hero section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative z-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider">
            Our Story
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight block text-slate-900 dark:text-white">
            <EditableText path="company.tagline">{company.tagline}</EditableText>
          </h1>
          <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            <EditableArea path="company.description">{company.description}</EditableArea>
          </div>
        </div>
      </section>

      {/* Mission & Vision cards */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl glass-card text-left space-y-4 border-primary-500/10">
            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-accent-400 w-fit shadow-inner">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Our Mission</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              To empower companies and startups to launch reliable, secure, and highly scalable technologies without the friction of fractured engineering coordination. We make elite software execution accessible.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-card text-left space-y-4 border-secondary-500/10">
            <div className="p-3 rounded-xl bg-secondary-50 dark:bg-secondary-950/40 text-secondary-600 dark:text-secondary-400 w-fit shadow-inner">
              <Eye className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Our Vision</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              To become a globally recognized venture incubator, driving technical innovations and building an interconnected digital suite of software startups that enhance MSME and enterprise workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-accent-400">Core Values</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            The Principles Guarding Our Code
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((v, idx) => {
            const Icon = LucideIcons[v.iconName] || LucideIcons.HelpCircle;
            return (
              <div key={idx} className="p-6 rounded-2xl glass-card text-left flex items-start space-x-4 border-slate-200/50 dark:border-slate-800/50 relative group">
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = values.filter((_, i) => i !== idx);
                      updatePath('values', next);
                    }}
                    className="absolute top-3 right-3 p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300"
                    title="Delete Value"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                
                <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 ${v.color || 'text-primary-500'} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-grow w-full">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white w-full">
                    <EditableText path={`values[${idx}].title`}>{v.title}</EditableText>
                  </h3>
                  <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed w-full">
                    <EditableArea path={`values[${idx}].desc`}>{v.desc}</EditableArea>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Value Block in Edit Mode */}
          {isEditMode && (
            <button
              onClick={() => {
                const next = [
                  ...values,
                  { iconName: 'Lightbulb', title: 'New Value', desc: 'Description of the core value.', color: 'text-primary-500' }
                ];
                updatePath('values', next);
              }}
              className="p-6 rounded-2xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex flex-col items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 min-h-[100px] gap-1"
            >
              <Plus className="w-5 h-5 animate-pulse" />
              <span>Add Value</span>
            </button>
          )}
        </div>
      </section>

      {/* Leadership team section */}
      <section className="py-20 bg-slate-50/50 dark:bg-darkCard/20 px-4 sm:px-6 lg:px-8 relative z-10 border-y border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-accent-400">Our Leadership</h2>
            <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
              Meet the Founders and Architects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div key={index} className="p-8 rounded-2xl glass-card text-center flex flex-col items-center space-y-4 relative group">
                {isEditMode && (
                  <button
                    onClick={() => {
                      const next = leaders.filter((_, i) => i !== index);
                      updatePath('leaders', next);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300"
                    title="Delete Leader"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                
                 <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500/20 shadow-md shadow-primary-500/10 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <img
                      src={getCleanUrl(leader.avatar)}
                      alt={leader.name}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      style={getCropStyle(leader.avatar)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => {
                        setUploadingIndex(index);
                        fileInputRef.current?.click();
                      }}
                      className="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors shadow-md border border-white dark:border-slate-900 cursor-pointer flex items-center justify-center"
                      title="Upload Photo"
                      disabled={uploadingIndex !== null}
                    >
                      {uploadingIndex === index ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <div className="w-full">
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white w-full">
                    <EditableText path={`leaders[${index}].name`}>{leader.name}</EditableText>
                  </h3>
                  <p className="text-primary-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider mt-1 w-full">
                    <EditableText path={`leaders[${index}].role`}>{leader.role}</EditableText>
                  </p>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs w-full">
                  <EditableArea path={`leaders[${index}].desc`}>{leader.desc}</EditableArea>
                </div>
              </div>
            ))}

            {/* Add Leader in Edit Mode */}
            {isEditMode && (
              <button
                onClick={() => {
                  const next = [
                    ...leaders,
                    { name: 'New Architect', role: 'Architect Partner', desc: 'Bio of the leader.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' }
                  ];
                  updatePath('leaders', next);
                }}
                className="p-8 rounded-2xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex flex-col items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 min-h-[300px] gap-2"
              >
                <Plus className="w-6 h-6 animate-pulse" />
                <span>Add Leader</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Future Roadmap section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary-600 dark:text-accent-400 flex items-center justify-center space-x-1">
            <Map className="w-4 h-4 mr-1 text-primary-500" />
            <span>Future Roadmap</span>
          </h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Strategic Path Forward
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-2 border-slate-200/60 dark:border-slate-800/60 ml-4 md:ml-32 space-y-12">
          {roadmap.map((point, index) => (
            <div key={index} className="relative pl-6 md:pl-8 text-left group">
              {/* Delete timeline button */}
              {isEditMode && (
                <button
                  onClick={() => {
                    const next = roadmap.filter((_, i) => i !== index);
                    updatePath('roadmap', next);
                  }}
                  className="absolute -left-12 top-2 p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300"
                  title="Delete Roadmap Milestone"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              
              {/* Year Marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary-500 border-4 border-lightBg dark:border-darkBg shadow" />

              {/* Offset box for year in desktop */}
              <div className="hidden md:block absolute -left-36 top-1 text-right w-28">
                <span className="font-display font-extrabold text-2xl text-primary-600 dark:text-accent-400 w-full">
                  <EditableText path={`roadmap[${index}].year`}>{point.year}</EditableText>
                </span>
              </div>

              {/* Box Details */}
              <div className="p-6 rounded-2xl glass-card relative w-full">
                {/* Year display for mobile */}
                <span className="inline-block md:hidden font-display font-extrabold text-lg text-primary-600 dark:text-accent-400 mb-2 w-full">
                  <EditableText path={`roadmap[${index}].year`}>{point.year}</EditableText>
                </span>
                
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2 w-full">
                  <EditableText path={`roadmap[${index}].title`}>{point.title}</EditableText>
                </h3>
                
                <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed w-full">
                  <EditableArea path={`roadmap[${index}].desc`}>{point.desc}</EditableArea>
                </div>
              </div>
            </div>
          ))}

          {/* Add Roadmap Milestone */}
          {isEditMode && (
            <div className="relative pl-6 md:pl-8 text-left">
              <button
                onClick={() => {
                  const next = [
                    ...roadmap,
                    { year: '2030', title: 'New Goal', desc: 'Roadmap details.' }
                  ];
                  updatePath('roadmap', next);
                }}
                className="w-full p-4 rounded-2xl border border-dashed border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/5 flex items-center justify-center text-primary-500 dark:text-accent-400 font-semibold cursor-pointer transition-all duration-300 gap-1.5"
              >
                <Plus className="w-4 h-4 animate-pulse" />
                <span>Add Roadmap Milestone</span>
              </button>
            </div>
          )}
        </div>
      </section>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Crop Modal */}
      {cropImageSrc && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
              Crop & Position Avatar
            </h3>
            
            {/* Live circular preview container */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/30 flex items-center justify-center bg-slate-100 dark:bg-slate-800 mb-6 shadow-inner relative">
              <img
                src={cropImageSrc}
                alt="Preview"
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{
                  transform: `scale(${cropScale}) translate(${cropX}%, ${cropY}%)`,
                  transformOrigin: 'center center',
                  objectPosition: 'center 20%'
                }}
              />
            </div>

            {/* Sliders */}
            <div className="w-full space-y-4 mb-4">
              <div className="flex flex-col">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Zoom / Scale</span>
                  <span>{cropScale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="4.0"
                  step="0.1"
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Horizontal Position (X)</span>
                  <span>{cropX}%</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={cropX}
                  onChange={(e) => setCropX(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Vertical Position (Y)</span>
                  <span>{cropY}%</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={cropY}
                  onChange={(e) => setCropY(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Position Presets */}
            <div className="flex items-center gap-2 mb-4 w-full">
              <button
                type="button"
                onClick={() => { setCropScale(1.4); setCropY(-25); setCropX(0); }}
                className="flex-1 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-semibold transition-colors cursor-pointer"
              >
                Center Face ⬆️
              </button>
              <button
                type="button"
                onClick={() => { setCropScale(1.0); setCropY(0); setCropX(0); }}
                className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset 🔄
              </button>
            </div>
            {/* Tip text */}
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mb-6 max-w-xs leading-normal">
              Tip: Zoom in (Scale &gt; 1.0x) before shifting offsets so the image covers the circular boundary without leaving empty background spaces.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setCropImageSrc(null);
                  setCropFile(null);
                  setUploadingIndex(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors cursor-pointer shadow-md shadow-amber-500/10"
              >
                Upload Full & Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
