import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { siteConfig as fallback } from '../data/siteConfig';

/**
 * Hook for admin pages to read and write the full site configuration.
 * - Reads from GET /api/admin/config (JWT-authenticated)
 * - Falls back to static siteConfig.js if API returns null/fails
 * - saveSection(key, newValue) patches one top-level key and sends PUT
 */
export function useAdminConfig() {
  const { token } = useAdminAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mgmt/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.ok ? await res.json() : null;
      setConfig(data && Object.keys(data).length > 0 ? data : { ...fallback });
    } catch {
      setConfig({ ...fallback });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  /** Update one top-level config key (e.g., 'services', 'products') */
  const saveSection = useCallback(async (section, value) => {
    const updated = { ...config, [section]: value };
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/mgmt/config', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setConfig(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        return true;
      } else {
        const err = await res.json();
        setSaveError(err.error || 'Save failed');
        return false;
      }
    } catch (err) {
      setSaveError(err.message || 'Network error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [config, token]);

  /** Update multiple top-level keys at once */
  const saveFull = useCallback(async (updatedConfig) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/mgmt/config', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(updatedConfig)
      });
      if (res.ok) {
        setConfig(updatedConfig);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        return true;
      }
      const err = await res.json();
      setSaveError(err.error || 'Save failed');
      return false;
    } catch (err) {
      setSaveError(err.message || 'Network error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [token]);

  return { config, loading, saving, saveError, saveSuccess, saveSection, saveFull, refetch: fetchConfig };
}