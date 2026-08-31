 import React from 'react';
import { motion } from 'framer-motion';
import { useTenant } from '../../context/TenantContext';
import { GraduationCap, QrCode, Timer, ListChecks, Wallet, Megaphone } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const FEATURES = [
  { icon: GraduationCap, title: 'Seat Booking', desc: 'Students choose a hall, shift, and seat, and book online in a few taps.' },
  { icon: QrCode, title: 'QR Attendance', desc: 'A single QR at the gate handles check-in and check-out automatically.' },
  { icon: Timer, title: 'Study Timer', desc: 'A pausable, persistent timer that survives logout or a device switch.' },
  { icon: ListChecks, title: 'To-Do List', desc: 'Subtasks, due dates, categories, and repeat tasks for daily planning.' },
  { icon: Wallet, title: 'Fees & Receipts', desc: 'Online or QR payments, with instant PDF receipts sent on WhatsApp.' },
  { icon: Megaphone, title: 'Notices', desc: 'Announcements and updates from the library, in one place.' },
];

const COLORS = [
  { grad: 'from-[#1B5FAE] to-[#29ABE2]', border: 'hover:border-[#29ABE2]/40' },
  { grad: 'from-[#F7941D] to-[#FDB813]', border: 'hover:border-[#FDB813]/40' },
  { grad: 'from-[#ED1C24] to-[#F04E5A]', border: 'hover:border-[#ED1C24]/40' },
];

const About = () => {
  const { library } = useTenant();

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B4C8C] via-[#F7941D] to-[#ED1C24] opacity-95" />
        <motion.div
          className="absolute -top-16 -right-10 w-64 h-64 bg-[#29ABE2] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-16 -left-10 w-72 h-72 bg-[#FDB813] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <motion.h1 {...fadeUp} transition={{ duration: 0.6 }} className="text-3xl sm:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            About {library?.name || 'Us'}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="text-white/95 leading-relaxed">
            {library?.name || 'Our library'} is a self-study space built around focus and
            accountability — real seats, real shifts, and simple tools to help you show up every day.
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="space-y-6 mb-14">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="relative bg-gray-50 border border-gray-100 rounded-2xl p-6 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#1B5FAE] to-[#29ABE2]" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Where we are</h2>
            <p className="text-gray-500 leading-relaxed">{library?.address || 'Address not available yet.'}</p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="relative bg-gray-50 border border-gray-100 rounded-2xl p-6 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#F7941D] to-[#ED1C24]" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">What we're about</h2>
            <p className="text-gray-500 leading-relaxed">
              We built this platform so every student can book a seat that fits their schedule, track their
              own study time, and stay accountable to a daily streak — without any of the usual admin friction.
            </p>
          </motion.div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] bg-clip-text text-transparent">
          What you get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={`bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all duration-300 ${color.border}`}
              >
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color.grad} flex items-center justify-center text-white mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-gray-800 font-semibold mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;