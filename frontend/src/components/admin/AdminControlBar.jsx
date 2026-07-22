import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminEdit } from '../../context/AdminEditContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Edit3, Eye, Save, RotateCcw, Layout, LogOut, Loader2, ShieldAlert,
  Inbox, Mail, Briefcase, GraduationCap, ExternalLink, X, KeyRound,
  EyeOff, CheckCircle2, ShieldCheck, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminControlBar() {
  const { 
    isEditMode, 
    setIsEditMode, 
    hasChanges, 
    saving, 
    error, 
    saveChanges, 
    discardChanges,
    isAdmin 
  } = useAdminEdit();
  
  const { token, logout, username } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Modals state
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Submissions state
  const [activeTab, setActiveTab] = useState('contacts');
  const [submissions, setSubmissions] = useState({ contacts: [], careers: [], internships: [] });
  const [loadingSubs, setLoadingSubs] = useState(false);

  // Change Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPwText, setShowPwText] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState(null); // { type: 'success'|'error', text }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showSubmissions || showPassword) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSubmissions, showPassword]);

  // Fetch submissions when opened
  useEffect(() => {
    if (showSubmissions && token) {
      setLoadingSubs(true);
      fetch('/api/mgmt/submissions', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d) setSubmissions(d); })
        .catch(err => console.error(err))
        .finally(() => setLoadingSubs(false));
    }
  }, [showSubmissions, token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPw.length < 8) {
      setPwMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    setSavingPw(true);
    setPwMsg(null);
    try {
      const res = await fetch('/api/mgmt/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw })
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg({ type: 'success', text: data.message || 'Password updated successfully!' });
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
      } else {
        setPwMsg({ type: 'error', text: data.error || 'Password update failed.' });
      }
    } catch {
      setPwMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSavingPw(false);
    }
  };

  // If not logged in, do not render the admin control bar
  if (!isAdmin) return null;

  // Do not show control bar on login screen
  if (location.pathname === '/admin/login') return null;

  return (
    <>
      {/* Floating Control Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-12 bg-slate-950/95 border-b border-primary-500/20 backdrop-blur-md px-4 flex items-center justify-between text-white text-xs shadow-xl shadow-slate-950/50">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 font-bold uppercase tracking-wider text-[9px]">
            <Layout className="w-3.5 h-3.5 text-primary-500" />
            <span>ArivTek LLPEditor</span>
          </span>
          
          {error && (
            <span className="hidden md:flex items-center space-x-1 text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>{error}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Toggle Visual Edit Mode */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-semibold tracking-wide transition-all duration-300 ${
              isEditMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 shadow-lg shadow-amber-500/5'
                : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {isEditMode ? (
              <>
                <Edit3 className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>Editing ON</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Visual Edit Mode</span>
              </>
            )}
          </button>

          {/* Change Actions if Dirty */}
          {hasChanges && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <button
                onClick={saveChanges}
                disabled={saving}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save</span>
              </button>
              <button
                onClick={discardChanges}
                disabled={saving}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:border-rose-500/30 hover:text-rose-400 hover:bg-rose-500/5 transition-all active:scale-[0.98]"
                title="Discard Changes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          )}

          <div className="h-4 w-px bg-slate-800" />

          {/* Overlays Controls */}
          <button
            onClick={() => setShowSubmissions(true)}
            className="text-slate-400 hover:text-white font-medium hover:underline transition-all flex items-center space-x-1"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submissions</span>
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="text-slate-400 hover:text-white font-medium hover:underline transition-all flex items-center space-x-1"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Users</span>
          </button>

          <button
            onClick={() => {
              setPwMsg(null);
              setShowPassword(true);
            }}
            className="text-slate-400 hover:text-white font-medium hover:underline transition-all flex items-center space-x-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Password</span>
          </button>

          <button
            onClick={() => {
              logout();
              setIsEditMode(false);
              navigate('/');
            }}
            className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition-all font-medium bg-transparent border-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* SUBMISSIONS MODAL */}
      <AnimatePresence>
        {showSubmissions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden text-left shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-primary-400" />
                    <span>Form Submissions</span>
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Leads, Careers, and Internship applications received from website visitors</p>
                </div>
                <button 
                  onClick={() => setShowSubmissions(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Control */}
              <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex gap-2">
                {[
                  { id: 'contacts', label: 'Contact Leads', icon: Mail, count: submissions.contacts.length },
                  { id: 'careers', label: 'Job Applications', icon: Briefcase, count: submissions.careers.length },
                  { id: 'internships', label: 'Internships', icon: GraduationCap, count: submissions.internships.length }
                ].map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === id
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Content Table */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20">
                {loadingSubs ? (
                  <div className="h-full flex items-center justify-center flex-col gap-2 text-slate-400 text-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <span>Loading submissions data...</span>
                  </div>
                ) : (
                  <div>
                    {activeTab === 'contacts' && (
                      <div className="overflow-x-auto">
                        {submissions.contacts.length === 0 ? (
                          <div className="text-center py-16 text-slate-500 text-xs">No contact message submissions found.</div>
                        ) : (
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Company</th>
                                <th className="py-3 px-4">Phone</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Message</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.contacts.map((c, i) => (
                                <tr key={i} className="border-b border-slate-850 hover:bg-white/[0.02] text-slate-300">
                                  <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                                  <td className="py-3.5 px-4">{c.email}</td>
                                  <td className="py-3.5 px-4 text-slate-400">{c.company || '—'}</td>
                                  <td className="py-3.5 px-4 text-slate-400">{c.phone || '—'}</td>
                                  <td className="py-3.5 px-4 text-slate-500">{c.timestamp ? new Date(c.timestamp).toLocaleDateString() : '—'}</td>
                                  <td className="py-3.5 px-4 max-w-xs truncate" title={c.message}>{c.message}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {activeTab === 'careers' && (
                      <div className="overflow-x-auto">
                        {submissions.careers.length === 0 ? (
                          <div className="text-center py-16 text-slate-500 text-xs">No career applications found.</div>
                        ) : (
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Phone</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Resume</th>
                                <th className="py-3 px-4">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.careers.map((c, i) => (
                                <tr key={i} className="border-b border-slate-850 hover:bg-white/[0.02] text-slate-300">
                                  <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                                  <td className="py-3.5 px-4">{c.email}</td>
                                  <td className="py-3.5 px-4 text-slate-400">{c.phone}</td>
                                  <td className="py-3.5 px-4 text-slate-300 font-medium">{c.role}</td>
                                  <td className="py-3.5 px-4">
                                    {c.resumeUrl ? (
                                      <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-400 hover:underline">
                                        <span>View Resume</span>
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                      </a>
                                    ) : '—'}
                                  </td>
                                  <td className="py-3.5 px-4 text-slate-500">{c.timestamp ? new Date(c.timestamp).toLocaleDateString() : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {activeTab === 'internships' && (
                      <div className="overflow-x-auto">
                        {submissions.internships.length === 0 ? (
                          <div className="text-center py-16 text-slate-500 text-xs">No internship applications found.</div>
                        ) : (
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">College</th>
                                <th className="py-3 px-4">Domain</th>
                                <th className="py-3 px-4">Resume</th>
                                <th className="py-3 px-4">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.internships.map((c, i) => (
                                <tr key={i} className="border-b border-slate-850 hover:bg-white/[0.02] text-slate-300">
                                  <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                                  <td className="py-3.5 px-4">{c.email}</td>
                                  <td className="py-3.5 px-4 text-slate-450">{c.college}</td>
                                  <td className="py-3.5 px-4 text-slate-300 font-medium">{c.domain}</td>
                                  <td className="py-3.5 px-4">
                                    {c.resumeUrl ? (
                                      <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-400 hover:underline">
                                        <span>View Resume</span>
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                      </a>
                                    ) : '—'}
                                  </td>
                                  <td className="py-3.5 px-4 text-slate-500">{c.timestamp ? new Date(c.timestamp).toLocaleDateString() : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden text-left shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <KeyRound className="w-4 h-4 text-violet-400" />
                  <span>Update Password</span>
                </h3>
                <button 
                  onClick={() => setShowPassword(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                {pwMsg && (
                  <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    pwMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-450'
                  }`}>
                    {pwMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ShieldCheck className="w-4 h-4 text-rose-500" />}
                    <span>{pwMsg.text}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Current Password</label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-700 focus:outline-none focus:border-violet-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">New Password</label>
                  <input
                    type={showPwText ? 'text' : 'password'}
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-700 focus:outline-none focus:border-violet-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Confirm New Password</label>
                  <input
                    type={showPwText ? 'text' : 'password'}
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-700 focus:outline-none focus:border-violet-500 transition-all"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="show-pws"
                    checked={showPwText}
                    onChange={e => setShowPwText(e.target.checked)}
                    className="rounded border-slate-800 text-violet-600 focus:ring-0 focus:ring-offset-0 bg-slate-950 w-3.5 h-3.5"
                  />
                  <label htmlFor="show-pws" className="text-[11px] text-slate-400 cursor-pointer select-none">Show Passwords</label>
                </div>

                <button
                  type="submit"
                  disabled={savingPw}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {savingPw ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
