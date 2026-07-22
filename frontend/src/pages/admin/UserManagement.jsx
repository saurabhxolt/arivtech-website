import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { UserPlus, Trash2, Shield, Calendar, Mail, Terminal, Layers } from 'lucide-react';

export default function UserManagement() {
  const { token, role } = useAdminAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('intern');
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mgmt/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === 'admin') {
      fetchUsers();
    }
  }, [token, role]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name || !username || !password || !userRole) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/mgmt/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, username, password, role: userRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      
      // Update list
      setUsers(prev => [data, ...prev]);
      
      // Reset form
      setName('');
      setUsername('');
      setPassword('');
      setUserRole('intern');
      setShowAddForm(false);
    } catch (err) {
      alert(`Error creating user: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to delete user account "${userToDelete}"?`)) return;
    try {
      const res = await fetch(`/api/mgmt/users?username=${encodeURIComponent(userToDelete)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      
      setUsers(prev => prev.filter(u => u.username !== userToDelete));
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This module is role-restricted. Only system administrators can manage portal employee and intern accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Portal User Accounts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and deploy access accounts for permanent staff and interns</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Registration' : 'Register New User'}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-md mb-8 max-w-lg mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-500" />
            <span>Create Portal Account</span>
          </h3>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Mrunal S"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Username</label>
              <input
                type="text"
                required
                placeholder="employee1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Portal Role</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="intern">Intern</option>
                <option value="employee">Employee (Staff)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-md transition-colors"
            >
              {submitting ? 'Registering...' : 'Register User'}
            </button>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs text-slate-500">Loading accounts...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-rose-500">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">No active portal users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-4 font-semibold">User Details</th>
                  <th className="pb-4 font-semibold">Username</th>
                  <th className="pb-4 font-semibold">Access Level</th>
                  <th className="pb-4 font-semibold">Registered</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map(user => (
                  <tr key={user.username} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="py-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">{user.name}</div>
                    </td>
                    <td className="py-4 font-mono text-slate-600 dark:text-slate-400">{user.username}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                        user.role === 'employee' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="p-2 rounded-lg bg-rose-500/5 hover:bg-rose-500 hover:text-white text-rose-500 transition-all cursor-pointer inline-flex items-center"
                        title="Delete Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
