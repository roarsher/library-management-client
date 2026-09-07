//  import React, { createContext, useContext, useEffect, useState } from 'react';
// import api from '../services/api';

// const TenantContext = createContext(null);

// // Multi-tenancy removed — this app now always serves one fixed library.
// // If you ever need multi-tenant support again, this is the one function
// // to change back to subdomain/domain-based resolution.
// const LIBRARY_ID = '6a9571ff82ff329f15173be4';

// export const TenantProvider = ({ children }) => {
//   const [library, setLibrary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadLibrary = async () => {
//       try {
//         const { data } = await api.get('/libraries/branding', {
//           params: { libraryId: LIBRARY_ID },
//         });

//         setLibrary(data.library);

//         document.title = data.library.name;
//         document.documentElement.style.setProperty(
//           '--brand-color',
//           data.library.themeColor || '#2563eb'
//         );

//         if (data.library.logoUrl) {
//           let favicon = document.querySelector("link[rel='icon']");
//           if (!favicon) {
//             favicon = document.createElement('link');
//             favicon.rel = 'icon';
//             document.head.appendChild(favicon);
//           }
//           favicon.href = data.library.logoUrl;
//         }
//       } catch (err) {
//         console.error('Library load error:', err);
//         setError(err.response?.data?.message || err.message || 'Could not load library');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadLibrary();
//   }, []);

//   return (
//     <TenantContext.Provider value={{ library, loading, error }}>
//       {children}
//     </TenantContext.Provider>
//   );
// };

// export const useTenant = () => useContext(TenantContext);

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const TenantContext = createContext(null);

// Multi-tenancy removed — this app now always serves one fixed library.
// If you ever need multi-tenant support again, this is the one function
// to change back to subdomain/domain-based resolution.
const LIBRARY_ID = '6a9571ff82ff329f15173be4';

export const TenantProvider = ({ children }) => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const { data } = await api.get('/libraries/branding', {
          params: { libraryId: LIBRARY_ID },
        });

        setLibrary(data.library);

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
        console.error('Library load error:', err);
        setError(err.response?.data?.message || err.message || 'Could not load library');
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, []);

  return (
    <TenantContext.Provider value={{ library, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);