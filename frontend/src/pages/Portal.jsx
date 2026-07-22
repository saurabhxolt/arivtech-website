import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Activity, 
  GitPullRequest, 
  Terminal, 
  LogOut, 
  User, 
  Lock, 
  Cpu, 
  HardDrive, 
  Layers 
} from 'lucide-react';

export default function Portal() {
  const { token, username, role, isAuthenticated, login, logout } = useAdminAuth();
  
  // Login Form States
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('');

  // Intern Log States
  const [progressLogs, setProgressLogs] = useState(() => {
    const saved = localStorage.getItem('intern_logs');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Configured local fallback DB and fixed EditableText children loading bugs.', date: '2026-07-21' },
      { id: 2, text: 'Researched Azurite connection string version overrides and implemented pipeline policy factory.', date: '2026-07-21' }
    ];
  });
  const [newLog, setNewLog] = useState('');

  // Intern Milestones State
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('intern_milestones');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Complete Azure Storage Blob adapter integration', completed: true },
      { id: 2, text: 'Implement visual cropper overlay for avatar uploads', completed: true },
      { id: 3, text: 'Draft role access matrix and secure authorization middleware', completed: true },
      { id: 4, text: 'Deploy role-based dashboard screens and verify telemetry widgets', completed: false }
    ];
  });

  // Employee Mock Review Queue
  const [reviewQueue, setReviewQueue] = useState([
    { id: 1, branch: 'feature/arivmart-login-roles', author: 'intern1', status: 'Pending Review', date: 'Just now' },
    { id: 2, branch: 'hotfix/cookie-expiry-salt', author: 'lead_dev', status: 'Pending Review', date: '2 hours ago' }
  ]);

  // Set default tab based on role
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'intern') {
        setActiveTab('playbook');
      } else if (role === 'employee') {
        setActiveTab('telemetry');
      }
    }
  }, [isAuthenticated, role]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginUser || !loginPass) return;
    setLoading(true);
    setError('');
    try {
      // Connect to portal user login
      await login(loginUser.trim(), loginPass, true);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.trim()) return;
    const logs = [
      { id: Date.now(), text: newLog.trim(), date: new Date().toISOString().split('T')[0] },
      ...progressLogs
    ];
    setProgressLogs(logs);
    localStorage.setItem('intern_logs', JSON.stringify(logs));
    setNewLog('');
  };

  const toggleMilestone = (id) => {
    const updated = milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    setMilestones(updated);
    localStorage.setItem('intern_milestones', JSON.stringify(updated));
  };

  const approveBranch = (id) => {
    setReviewQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
  };

  // Redirect Admin users to standard Admin layout
  if (isAuthenticated && role === 'admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <Layers className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">Admin Account Detected</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You are currently logged in as an Administrator. Administrators manage site configs via the main top control panel.
          </p>
          <button
            onClick={logout}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer shadow-md transition-colors"
          >
            Log Out from Admin
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated screen (User Portal Login)
  if (!isAuthenticated || (role !== 'employee' && role !== 'intern')) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
              <Terminal className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">ArivTek Team Portal</h2>
            <p className="text-xs text-slate-500 mt-1.5">Sign in to access your designated sandbox or workspace</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Portal Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="employee1 or intern1"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-500 text-center bg-rose-500/5 py-2.5 rounded-xl border border-rose-500/10">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Portal View
  return (
    <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-amber-500/15 text-amber-500`}>
                {role}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-1">
              Welcome, {username}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Role-restricted workspace & sandboxed dashboard tools</p>
          </div>
          
          <button
            onClick={logout}
            className="self-start md:self-center flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-500/5 hover:border-rose-500/20 text-slate-500 hover:text-rose-500 text-sm font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            {role === 'intern' && (
              <>
                <button
                  onClick={() => setActiveTab('playbook')}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                    activeTab === 'playbook' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>ArivTek Playbook</span>
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                    activeTab === 'logs' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Daily Progress Logs</span>
                </button>
                <button
                  onClick={() => setActiveTab('milestones')}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                    activeTab === 'milestones' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Milestone Checklist</span>
                </button>
              </>
            )}

            {role === 'employee' && (
              <>
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                    activeTab === 'telemetry' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Dev Telemetry</span>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                    activeTab === 'reviews' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Peer PR Reviews</span>
                </button>
              </>
            )}
          </div>

          {/* Main Display Pane */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
              
              {/* INTERN TABS */}
              {role === 'intern' && activeTab === 'playbook' && (
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">ArivTek Playbook</h2>
                  <p className="text-xs text-slate-500 mb-6">Read-only code architectures and setup guidelines for trainees</p>
                  
                  <div className="space-y-6">
                    <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white mb-2 text-sm">1. Local Fallback Architecture</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        To enable serverless development without relying on active cloud connections, developers use the local `db.json` database adapter. Never write credentials in code; the fallback resolves connection strings automatically.
                      </p>
                    </div>

                    <div className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white mb-2 text-sm">2. Azurite CORS Configuration</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        When testing files locally, override the storage API request version to `2020-10-02` by attaching custom HTTP Pipeline policies. This bypasses client-side version checks and makes local preview loads fully functional.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {role === 'intern' && activeTab === 'logs' && (
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">Daily Progress Logs</h2>
                  <p className="text-xs text-slate-500 mb-6">Document your completed milestones, logs, and blockers for review</p>
                  
                  <form onSubmit={handleAddLog} className="flex gap-3 mb-6">
                    <input
                      type="text"
                      required
                      placeholder="Today I worked on..."
                      value={newLog}
                      onChange={(e) => setNewLog(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm cursor-pointer transition-colors"
                    >
                      Log Entry
                    </button>
                  </form>

                  <div className="space-y-4">
                    {progressLogs.map(log => (
                      <div key={log.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-start gap-4">
                        <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{log.text}</span>
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{log.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {role === 'intern' && activeTab === 'milestones' && (
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">Milestone Checklist</h2>
                  <p className="text-xs text-slate-500 mb-6">Follow your project tracking points to complete the syllabus</p>
                  
                  <div className="space-y-3">
                    {milestones.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => toggleMilestone(m.id)}
                        className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                          m.completed 
                            ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-600 dark:text-emerald-400' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/20 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={m.completed}
                          readOnly
                          className="w-4 h-4 accent-emerald-500 pointer-events-none"
                        />
                        <span className={`text-xs ${m.completed ? 'line-through opacity-85' : ''}`}>{m.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EMPLOYEE TABS */}
              {role === 'employee' && activeTab === 'telemetry' && (
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">Dev Telemetry</h2>
                  <p className="text-xs text-slate-500 mb-6">Real-time stats of localized Azure services and server sandboxes</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">CPU Usage</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">18.4%</div>
                      </div>
                    </div>

                    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <HardDrive className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Memory Allocation</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">42.1%</div>
                      </div>
                    </div>

                    <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Service Status</div>
                        <div className="text-lg font-bold text-emerald-500">Active (7071)</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/20 dark:bg-slate-950/10">
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Console Logs</span>
                    </h4>
                    <div className="bg-slate-950 text-slate-300 font-mono text-[10px] p-4 rounded-xl space-y-2 border border-slate-800 max-h-48 overflow-y-auto">
                      <div>[2026-07-21 23:42:01] AzureWebJobsStorage binding successful.</div>
                      <div>[2026-07-21 23:42:02] Local fallback db loaded from db.json.</div>
                      <div>[2026-07-21 23:42:03] CORS proxy listening on http://localhost:7071.</div>
                      <div className="text-slate-400 animate-pulse">&gt;_ Waiting for new request triggers...</div>
                    </div>
                  </div>
                </div>
              )}

              {role === 'employee' && activeTab === 'reviews' && (
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">Peer PR Reviews</h2>
                  <p className="text-xs text-slate-500 mb-6">Review code branch submissions from junior developers and interns</p>
                  
                  <div className="space-y-4">
                    {reviewQueue.map(item => (
                      <div key={item.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{item.branch}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                              item.status === 'Approved' 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">Submitted by: {item.author} • {item.date}</div>
                        </div>

                        {item.status === 'Pending Review' && (
                          <button
                            onClick={() => approveBranch(item.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors shadow-md shadow-emerald-600/5 self-start md:self-center"
                          >
                            Approve & Merge
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
