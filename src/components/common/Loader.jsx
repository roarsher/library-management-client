import React from 'react';

const Loader = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <div className="h-8 w-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-3" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Loader;
