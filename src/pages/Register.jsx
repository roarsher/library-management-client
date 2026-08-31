 import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import * as referralService from '../services/referralService';
import gyanLogo from '../assets/gyan-library-logo.png'; // adjust path to your actual logo file

const Register = () => {
  const { library } = useTenant();
  const { sendOtp, verifyOtpAndRegister } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  // Pre-fills from a shared link like /register?ref=REF-ABC123, but the
  // student can also type a friend's code manually.
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendOtp(form.email);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtpAndRegister({ ...form, otp, libraryId: library?._id });

      if (referralCode.trim()) {
        // Non-fatal — don't block account creation if the code is invalid
        await referralService.redeemReferralCode(referralCode.trim()).catch(() => {});
      }

      navigate('/students/admission'); // straight into the admission form next
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
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
        className="pointer-events-none select-none absolute top-1/2 left-1/2 w-[36rem] h-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.14] object-contain"
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
            Welcome to {library?.name || 'the library'}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-gray-500"
          >
            Create your student account to get started.
          </motion.p>
        </div>

        {/* Box-opening entrance for the form card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 'details' ? (
              <motion.form
                key="details"
                onSubmit={handleSendOtp}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="card space-y-4 bg-white/95 backdrop-blur-sm"
              >
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="input-field focus:ring-2 focus:ring-[#29ABE2]/50 focus:border-[#29ABE2] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="input-field focus:ring-2 focus:ring-[#29ABE2]/50 focus:border-[#29ABE2] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                  <input
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="input-field focus:ring-2 focus:ring-[#F7941D]/50 focus:border-[#F7941D] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={handleChange}
                    className="input-field focus:ring-2 focus:ring-[#ED1C24]/50 focus:border-[#ED1C24] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Referral Code <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="e.g. REF-ABC123"
                    className="input-field focus:ring-2 focus:ring-[#29ABE2]/50 focus:border-[#29ABE2] transition-colors"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-2.5 font-semibold text-white bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 shadow-md disabled:opacity-60"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                onSubmit={handleVerify}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="card space-y-4 bg-white/95 backdrop-blur-sm"
              >
                {error && <p className="text-sm text-red-500">{error}</p>}
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to <strong>{form.email}</strong>
                </p>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="input-field text-center tracking-widest text-lg focus:ring-2 focus:ring-[#F7941D]/50 focus:border-[#F7941D] transition-colors"
                  placeholder="------"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-2.5 font-semibold text-white bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 shadow-md disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-gray-400 w-full text-center hover:text-gray-600 transition-colors"
                >
                  Wrong email? Go back
                </button>
              </motion.form>
            )}
          </AnimatePresence>

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
      </div>
    </div>
  );
};

export default Register;