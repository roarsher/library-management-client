 
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

const publicLinkClasses = ({ isActive }) =>
  `relative text-sm font-medium pb-1 transition-colors after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#1B5FAE] after:via-[#F7941D] after:to-[#ED1C24] after:origin-left after:transition-transform after:duration-300 ${
    isActive
      ? 'text-[#1B5FAE] after:scale-x-100'
      : 'text-gray-500 hover:text-gray-700 after:scale-x-0 hover:after:scale-x-100'
  }`;

const mobilePublicLinkClasses = ({ isActive }) =>
  `block w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] text-white'
      : 'text-gray-600 hover:bg-gray-50'
  }`;

const studentLinkClasses = ({ isActive }) =>
  `px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-gray-900 text-white'
      : 'text-gray-500 hover:bg-gray-100'
  }`;

const mobileStudentLinkClasses = ({ isActive }) =>
  `block w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-gray-900 text-white'
      : 'text-gray-600 hover:bg-gray-50'
  }`;

// ==============================
// PUBLIC LINKS
// ==============================
const PUBLIC_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

// ==============================
// STUDENT LINKS
// ==============================
const STUDENT_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/book/seat', label: 'Book a Seat' },
  { to: '/leave', label: 'Leave' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/profile', label: 'Profile' },
];

// ==============================
// ADMIN SIDEBAR LINKS
// Same routes as your Sidebar.jsx
// ==============================
const ADMIN_LINKS = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/bookings', label: '🎟️ Bookings' },
  { to: '/admin/students', label: '🎓 Students' },
  { to: '/admin/halls', label: '🪑 Halls & Seats' },
  { to: '/admin/leaves', label: '📅 Leave Requests' },
  { to: '/admin/payments', label: '💳 Payments' },
  { to: '/admin/gallery', label: '🖼️ Gallery' },
  { to: '/admin/broadcast', label: '📢 Broadcast' },
  { to: '/admin/analytics', label: '📈 Analytics' },
  { to: '/admin/settings', label: '⚙️ Settings' },
  { to: '/admin/gate-display', label: '🔑 Gate QR Codes' },
];
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning 🌅";
    if (h < 17) return "Good Afternoon ☀️";
    if (h < 20) return "Good Evening 🌆";
    return "Good Night 🌙";
  };

const Navbar = () => {
  const { library } = useTenant();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">

      {/* =========================================
          MAIN NAVBAR
      ========================================= */}
      <header className="relative bg-white h-16 flex items-center">
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24]" />

        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={closeMobile}
          >
            {library?.logoUrl ? (
              <img
                src={library.logoUrl}
                alt={library.name}
                className="h-9 w-9 rounded-lg object-cover ring-2 ring-offset-2 ring-[#F7941D]/40"
              />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] flex items-center justify-center text-white font-bold shadow-sm">
                {library?.name?.[0] || 'L'}
              </div>
            )}

            <span className="font-semibold text-gray-800 text-lg">
              {library?.name || 'Library'}
            </span>
          </Link>

          {/* =========================================
              PUBLIC DESKTOP NAV
          ========================================= */}
          {!user && (
            <nav className="hidden md:flex items-center gap-6">
              {PUBLIC_LINKS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={publicLinkClasses}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* =========================================
              DESKTOP ACCOUNT
          ========================================= */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'student' && <NotificationBell />}

                <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] capitalize">
                  {user.role}
                </span>

                <button
                  onClick={logout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* =========================================
              MOBILE
          ========================================= */}
          <div className="flex items-center gap-2 md:hidden">

            {user?.role === 'student' && <NotificationBell />}

            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>
      </header>

      {/* =========================================
          STUDENT DESKTOP QUICK LINKS
      ========================================= */}
      {user?.role === 'student' && (
        <div className="hidden md:flex bg-white border-b border-gray-100 h-14 items-center">
          <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4">

            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-gray-800">
                {getGreeting()}, {user?.name?.split(' ')[0]}
              </span>

              <span className="text-xs text-gray-400 ml-2">
                {today}
              </span>
            </div>

            <nav className="flex items-center gap-1 overflow-x-auto">
              {STUDENT_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={studentLinkClasses}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

          </div>
        </div>
      )}

      {/* =========================================
          MOBILE MENU
      ========================================= */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">

          {/* =====================================
              ADMIN MOBILE MENU
          ===================================== */}
          {user?.role === 'admin' || user?.role === 'superadmin' ? (
            <div className="p-4">

              {/* Admin heading */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Admin Dashboard
                  </p>

                  <p className="text-xs text-gray-400">
                    {getGreeting()}, {user?.name?.split(' ')[0]}
                  </p>
                </div>

                <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] capitalize">
                  {user.role}
                </span>
              </div>

              {/* Admin sidebar links */}
              <nav className="flex flex-col gap-1">
                {ADMIN_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* Admin logout */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    logout();
                    closeMobile();
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 text-left"
                >
                  🚪 Logout
                </button>
              </div>

            </div>

          ) : (

            /* =====================================
               PUBLIC / STUDENT MOBILE MENU
            ===================================== */
            <div className="px-4 py-3">

              {user?.role === 'student' && (
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-800">
                    {getGreeting()}, {user?.name?.split(' ')[0]}
                  </span>

                  <p className="text-xs text-gray-400">
                    {today}
                  </p>
                </div>
              )}

              <nav className="flex flex-col gap-1 mb-3">

                {(user?.role === 'student'
                  ? STUDENT_LINKS
                  : PUBLIC_LINKS
                ).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={closeMobile}
                    className={
                      user?.role === 'student'
                        ? mobileStudentLinkClasses
                        : mobilePublicLinkClasses
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

              </nav>

              {/* Account actions */}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">

                {user ? (
                  <>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full text-white bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] capitalize w-fit">
                      {user.role}
                    </span>

                    <button
                      onClick={() => {
                        logout();
                        closeMobile();
                      }}
                      className="btn-secondary text-sm w-full"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobile}
                      className="text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-center"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobile}
                      className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] text-center shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Navbar;
 
