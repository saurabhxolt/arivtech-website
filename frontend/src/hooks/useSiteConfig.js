import { useState, useEffect } from 'react';
import { siteConfig as fallbackConfig } from '../data/siteConfig';

export function useSiteConfig() {
  const [config, setConfig] = useState(fallbackConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadConfig() {
      try {
        const res = await fetch('/api/site-config');
        if (res.ok) {
          const data = await res.json();
          if (active && data) {
            // Merge static local fallback with dynamic backend config if needed, 
            // or use backend config entirely
            setConfig(data);
          }
        }
      } catch (err) {
        // Silently fail and use local fallback
        console.log('Site configuration API not reachable. Using local config.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadConfig();
    return () => {
      active = false;
    };
  }, []);

  return { config, loading };
}