 import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const TenantContext = createContext(null);

// Turns "sunrise.yourapp.com" -> "sunrise"
const getSubdomainFromHostname = () => {
  const host = window.location.hostname;
  const parts = host.split('.');

  // localhost / IP
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
        const devLibraryId = process.env.REACT_APP_DEV_LIBRARY_ID;

        let params;

        // IMPORTANT:
        // If a library ID is configured, always use it.
        // This prevents Vercel's hostname from being treated
        // as a library subdomain.
        if (devLibraryId) {
          params = { libraryId: devLibraryId };
        } else {
          const subdomain = getSubdomainFromHostname();

          if (!subdomain) {
            throw new Error(
              'No library could be resolved. Set REACT_APP_DEV_LIBRARY_ID.'
            );
          }

          params = { domain: subdomain };
        }

        console.log('Resolving library with:', params);

        const { data } = await api.get('/libraries/branding', {
          params,
        });

        setLibrary(data.library);

        // Apply white-label branding
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
        console.error('Library resolution error:', err);

        setError(
          err.response?.data?.message ||
          err.message ||
          'Could not load library'
        );
      } finally {
        setLoading(false);
      }
    };

    resolveLibrary();
  }, []);

  return (
    <TenantContext.Provider
      value={{
        library,
        loading,
        error,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);