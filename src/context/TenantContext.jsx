import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const TenantContext = createContext(null);

// Turns "sunrise.yourapp.com" -> "sunrise", "yourapp.com" -> null (marketing/root domain)
const getSubdomainFromHostname = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  // localhost / plain IPs during dev never have a meaningful subdomain
  if (parts.length < 3) return null;
  return parts[0];
};

export const TenantProvider = ({ children }) => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resolveLibrary = async () => {
      try {
        const subdomain = getSubdomainFromHostname();
        // Local dev has no real subdomain, so fall back to an env var
        // pointing at a library's Mongo _id you're testing against.
        const devLibraryId = process.env.REACT_APP_DEV_LIBRARY_ID;

        const params = subdomain ? { domain: subdomain } : { libraryId: devLibraryId };
        if (!params.domain && !params.libraryId) {
          throw new Error(
            'No library could be resolved. Set REACT_APP_DEV_LIBRARY_ID for local development.'
          );
        }

        const { data } = await api.get('/libraries/branding', { params });
        setLibrary(data.library);

        // Apply white-label branding at runtime — no rebuild needed per tenant
        document.title = data.library.name;
        document.documentElement.style.setProperty(
          '--brand-color',
          data.library.themeColor || '#2563eb'
        );
        if (data.library.logoUrl) {
          let favicon = document.querySelector("link[rel='icon']");
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
          }
          favicon.href = data.library.logoUrl;
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    resolveLibrary();
  }, []);

  return (
    <TenantContext.Provider value={{ library, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
