import React, { createContext, useContext, useState, useCallback } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('admin_user'));
  const [role, setRole] = useState(() => localStorage.getItem('admin_role'));

  const login = useCallback(async (user, pass, isPortalUser = false) => {
    const endpoint = isPortalUser ? '/api/mgmt/user-login' : '/api/mgmt/login';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    const userRole = data.role || 'admin';

    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', data.username);
    localStorage.setItem('admin_role', userRole);
    setToken(data.token);
    setUsername(data.username);
    setRole(userRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_role');
    setToken(null);
    setUsername(null);
    setRole(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ token, username, role, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}