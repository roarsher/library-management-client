 import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, QrCode, Timer, ListChecks, Wallet, Megaphone } from 'lucide-react';
import { useTenant } from '../context/TenantContext';

const FEATURES = [
  { icon: GraduationCap, title: 'Seat Booking', description: 'Choose your hall, shift, and seat — book online in a few taps.' },
  { icon: QrCode, title: 'QR Attendance', description: 'Scan the gate QR to check in and out, tracked automatically.' },
  { icon: Timer, title: 'Study Timer', description: 'Track focused study sessions that pick up right where you left off.' },
  { icon: ListChecks, title: 'To-Do List', description: 'Plan your day with tasks, subtasks, and due dates.' },
  { icon: Wallet, title: 'Fees & Payments', description: 'Pay online or via QR, and download receipts anytime.' },
  { icon: Megaphone, title: 'Notices & Updates', description: 'Stay in the loop with announcements from the library.' },
];

// Cycles through the logo's blue / orange / red palette
const COLORS = [
  { grad: 'from-[#1B5FAE] to-[#29ABE2]', glow: 'hover:shadow-[0_10px_30px_-8px_rgba(41,171,226,0.5)]' },
  { grad: 'from-[#F7941D] to-[#FDB813]', glow: 'hover:shadow-[0_10px_30px_-8px_rgba(253,184,19,0.5)]' },
  { grad: 'from-[#ED1C24] to-[#F04E5A]', glow: 'hover:shadow-[0_10px_30px_-8px_rgba(237,28,36,0.5)]' },
];

const Home = () => {
  const { library } = useTenant();

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 py-20 sm:py-28 text-center overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B4C8C] via-[#F7941D] to-[#ED1C24]" />

        {/* Rotating sunburst, echoing the logo */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[36rem] h-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-25 pointer-events-none"
          style={{
            background:
              'repeating-conic-gradient(from 0deg, #FDB813 0deg 8deg, transparent 8deg 20deg)',
            borderRadius: '9999px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating blobs */}
        <motion.div
          className="absolute -top-20 -left-16 w-72 h-72 bg-[#29ABE2] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-16 w-80 h-80 bg-[#FDB813] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] mb-4"
          >
            {library?.name || 'Your Library'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-white/95 text-base sm:text-lg font-medium max-w-xl mx-auto"
          >
            A smart study-space platform to manage seats, attendance, study time, and fees — all in one place.
          </motion.p>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={`group rounded-2xl bg-white border border-gray-100 shadow-sm p-6 transition-all duration-300 ${color.glow}`}
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="text-gray-800 font-semibold text-lg mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative px-6 py-14 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24]" />
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative text-white text-2xl sm:text-3xl font-bold"
        >
          Ready to book your seat?
        </motion.h2>
      </section>
    </div>
  );
};

export default Home;