 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import gyanLogo from '../assets/gyan-library-logo.png'; // adjust path to your actual logo file

const Login = () => {
  const { library } = useTenant();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B4C8C]/5 via-[#F7941D]/5 to-[#ED1C24]/5 px-4 overflow-hidden">
      {/* Faded logo watermark — low opacity so form text stays fully readable */}
      <img
        src={gyanLogo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-1/2 left-1/2 w-[36rem] h-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.1] object-contain"
      />

      {/* Subtle ambient blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 bg-[#29ABE2] rounded-full blur-3xl opacity-10"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#FDB813] rounded-full blur-3xl opacity-10"
        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          {library?.logoUrl ? (
            <motion.img
              src={library.logoUrl}
              alt={library.name}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="h-14 w-14 rounded-xl mx-auto mb-3 object-cover shadow-md"
            />
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-md"
            >
              {library?.name?.[0] || 'L'}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-bold bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] bg-clip-text text-transparent"
          >
            Welcome back to {library?.name || 'the library'}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-gray-500"
          >
            Sign in to pick up right where you left off.
          </motion.p>
        </div>

        {/* Box-opening entrance for the login card */}
        <div className="relative">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="card space-y-4 bg-white/95 backdrop-blur-sm"
          >
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field focus:ring-2 focus:ring-[#29ABE2]/50 focus:border-[#29ABE2] transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field focus:ring-2 focus:ring-[#ED1C24]/50 focus:border-[#ED1C24] transition-colors"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-2.5 font-semibold text-white bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 shadow-md disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </motion.form>

          {/* Chest lid — swings open on load to reveal the form underneath */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -120 }}
            onAnimationComplete={() => setBoxOpen(true)}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="absolute inset-x-0 top-0 h-16 rounded-t-2xl bg-gradient-to-br from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] shadow-lg z-10 flex items-center justify-center"
          >
            <span className="h-2 w-10 rounded-full bg-white/70" />
          </motion.div>

          {/* Sparkle burst right as the lid finishes opening */}
          <AnimatePresence>
            {boxOpen && (
              <motion.div
                initial={{ opacity: 1, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#FDB813] pointer-events-none"
              >
                <Sparkles size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-center text-sm text-gray-500 mt-4"
        >
          New here?{' '}
          <Link to="/register" className="text-[#1B5FAE] font-medium hover:text-[#ED1C24] transition-colors">
            Create an account
          </Link>
        </motion.p>
      </div>
    </div>
  );
};

export default Login;