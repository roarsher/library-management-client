 

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: '🎟️' },
  { to: '/admin/students', label: 'Students', icon: '🎓' },
  { to: '/admin/halls', label: 'Halls & Seats', icon: '🪑' },
  { to: '/admin/leaves', label: 'Leave Requests', icon: '📅' },
  { to: '/admin/payments', label: 'Payments', icon: '💳' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/broadcast', label: 'Broadcast', icon: '📢' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { to: '/admin/gate-display', label: 'Gate QR Codes', icon: '🔑' },
];

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand text-white'
      : 'text-gray-600 hover:bg-gray-100'
  }`;

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* =====================================================
          MOBILE HAMBURGER BUTTON
          Visible only on mobile
      ===================================================== */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 h-10 w-10 rounded-lg bg-white shadow-md border border-gray-100 flex items-center justify-center text-xl text-gray-700"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* =====================================================
          DESKTOP SIDEBAR
          Visible from md (768px) and above
      ===================================================== */}
      <aside className="hidden md:block w-56 shrink-0 border-r border-gray-100 bg-white min-h-[calc(100vh-4rem)] p-3">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClasses}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* =====================================================
          MOBILE OVERLAY
          Dark background behind sidebar
      ===================================================== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* =====================================================
          MOBILE SIDEBAR / DRAWER
      ===================================================== */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {/* Mobile sidebar header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            Admin Dashboard
          </h2>

          <button
            onClick={() => setMobileOpen(false)}
            className="h-9 w-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-2xl text-gray-500"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Mobile navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={linkClasses}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
 
