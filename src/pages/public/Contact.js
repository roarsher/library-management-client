 import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import DeveloperCard from '../../components/cards/DeveloperCard';
import riteshImg from '../../assets/rituatts.jpeg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const developer = {
  name: 'Ritesh Kumar',
  role: 'Frontend & Backend Developer',
  image: riteshImg,
  email: 'ritesh@example.com',
  linkedin: 'https://linkedin.com/in/ritesh',
  twitter: 'https://twitter.com/ritesh',
};

const ContactForm = ({ toEmail }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name || 'website visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${toEmail || ''}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-3 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24]" />
      <h2 className="text-xl font-semibold text-gray-800 mb-1">Send a message</h2>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Your name"
        required
        className="input-field w-full focus:ring-2 focus:ring-[#29ABE2]/50 focus:border-[#29ABE2] transition-colors"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        type="email"
        placeholder="Your email"
        required
        className="input-field w-full focus:ring-2 focus:ring-[#F7941D]/50 focus:border-[#F7941D] transition-colors"
      />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Your message"
        required
        rows={4}
        className="input-field w-full resize-none focus:ring-2 focus:ring-[#ED1C24]/50 focus:border-[#ED1C24] transition-colors"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full rounded-xl py-2.5 font-semibold text-white bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 shadow-md"
      >
        Send
      </motion.button>
    </form>
  );
};

const Contact = () => {
  const { library } = useTenant();

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B4C8C] via-[#F7941D] to-[#ED1C24] opacity-95" />
        <motion.div
          className="absolute -top-10 left-10 w-56 h-56 bg-[#29ABE2] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="relative">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">Contact Us</h1>
          <p className="text-white/90">Library & developer contact information</p>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Library Contact</h2>
            <p className="flex items-start gap-3 text-gray-600 text-sm">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1B5FAE] to-[#29ABE2] flex items-center justify-center text-white flex-shrink-0">
                <MapPin size={16} />
              </span>
              {library?.address || 'Address not available'}
            </p>
            <p className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#F7941D] to-[#FDB813] flex items-center justify-center text-white flex-shrink-0">
                <Mail size={16} />
              </span>
              {library?.contactEmail || 'Not available'}
            </p>
            <p className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#ED1C24] to-[#F04E5A] flex items-center justify-center text-white flex-shrink-0">
                <Phone size={16} />
              </span>
              {library?.contactPhone || 'Not available'}
            </p>
            {library?.address && (
              <iframe
                title="Library location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(library.address)}&output=embed`}
                className="w-full h-48 rounded-xl border border-gray-200 mt-2"
                loading="lazy"
              />
            )}
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <ContactForm toEmail={library?.contactEmail} />
          </motion.div>
        </div>

        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-[#1B5FAE] via-[#F7941D] to-[#ED1C24] bg-clip-text text-transparent">
            Project Developer
          </h2>
          <div className="flex justify-center">
            <DeveloperCard {...developer} />
          </div>
        </motion.div>

        <p className="text-center text-gray-400 text-sm mt-14">
          © {new Date().getFullYear()} {library?.name || 'Library'} · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Contact;