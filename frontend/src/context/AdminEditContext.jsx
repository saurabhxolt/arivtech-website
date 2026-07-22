import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { useSiteConfig } from '../hooks/useSiteConfig';

const AdminEditContext = createContext(null);

// Helper function to set nested object paths dynamically (e.g., 'company.name', 'services.0.title')
function setNestedValue(obj, path, value) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  const newObj = JSON.parse(JSON.stringify(obj)); // Deep copy to avoid mutating original state
  let current = newObj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = isNaN(parts[i + 1]) ? {} : [];
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
  return newObj;
}

export function AdminEditProvider({ children }) {
  const { token, isAuthenticated } = useAdminAuth();
  const { config: remoteConfig, loading: configLoading } = useSiteConfig();
  
  const [config, setConfig] = useState(remoteConfig);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Keep draft config in sync when remote config loads
  useEffect(() => {
    if (remoteConfig) {
      setConfig(remoteConfig);
    }
  }, [remoteConfig]);

  // Track if changes have been made compared to the server config
  useEffect(() => {
    if (!remoteConfig || !config) return;
    const isDifferent = JSON.stringify(remoteConfig) !== JSON.stringify(config);
    setHasChanges(isDifferent);
  }, [config, remoteConfig]);

  const updatePath = useCallback((path, value) => {
    setConfig((prev) => setNestedValue(prev, path, value));
  }, []);

  const discardChanges = useCallback(() => {
    setConfig(remoteConfig);
    setError(null);
  }, [remoteConfig]);

  const saveChanges = useCallback(async () => {
    if (!token) {
      setError('Not authenticated');
      return false;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/mgmt/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        // Force refresh: in a production setting we'd update the global cache,
        // here we'll reload the config context simply by mutating the reference
        window.location.reload(); // Simple, clean reload to sync the server defaults
        return true;
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to save configuration');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Network error occurred');
      return false;
    } finally {
      setSaving(false);
    }
  }, [config, token]);

  // Turn off edit mode automatically on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setIsEditMode(false);
    }
  }, [isAuthenticated]);

  return (
    <AdminEditContext.Provider
      value={{
        config,
        loading: configLoading,
        isEditMode: isAuthenticated && isEditMode,
        setIsEditMode,
        hasChanges,
        saving,
        error,
        updatePath,
        saveChanges,
        discardChanges,
        isAdmin: isAuthenticated
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
}

export function useAdminEdit() {
  const context = useContext(AdminEditContext);
  if (!context) {
    throw new Error('useAdminEdit must be used within an AdminEditProvider');
  }
  return context;
}
