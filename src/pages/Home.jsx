 import React from 'react';
import { motion } from 'framer-motion';

import {
  Wifi,
  Camera,
  Snowflake,
  BatteryCharging,
  Newspaper,
  BookOpen,
  Armchair,
  Printer,
  Fingerprint,
  Droplets,
  Bike,
  Utensils,
  Coffee,
  Users,
  CalendarCheck,
  QrCode,
  Timer,
  Wallet,
  Megaphone,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

import { useTenant } from '../context/TenantContext';

// ======================================================
// IMAGES
// ======================================================

import wifiImg from '../assets/wifi.jpg';
import cctvImg from '../assets/cctv.jpg';
import studyEnvironmentImg from '../assets/study-environment.jpg';
import acImg from '../assets/ac.jpg';
import batteryImg from '../assets/battery-backup.jpg';
import newspaperImg from '../assets/newspaper.jpg';
import booksImg from '../assets/books.jpg';
import magazineImg from '../assets/magazine.jpg';
import cabinImg from '../assets/separate-cabin.jpg';
import printingImg from '../assets/printing.jpg';
import biometricImg from '../assets/biometric.jpg';

import waterImg from '../assets/ro-water.jpg';
import parkingImg from '../assets/parking.jpg';
import lunchRoomImg from '../assets/lunch-room.jpg';
import teaCoffeeImg from '../assets/tea-coffee.jpg';
import girlsAreaImg from '../assets/girls-area.jpg';

// ======================================================
// SERVICES
// ======================================================

const SERVICES = [
  {
    icon: Wifi,
    title: 'Free Wi-Fi',
    description:
      'High-speed internet connectivity for study and learning.',
    image: wifiImg,
  },
  {
    icon: Camera,
    title: 'CCTV Surveillance',
    description:
      '24×7 CCTV surveillance for a safe and secure environment.',
    image: cctvImg,
  },
  {
    icon: BookOpen,
    title: 'Peaceful Study Environment',
    description:
      'A clean, peaceful and distraction-free environment.',
    image: studyEnvironmentImg,
  },
  {
    icon: Snowflake,
    title: 'Fully Air-Conditioned',
    description:
      'Comfortable temperature throughout your study hours.',
    image: acImg,
  },
  {
    icon: BatteryCharging,
    title: '24×7 Power Backup',
    description:
      'Uninterrupted study with reliable battery backup.',
    image: batteryImg,
  },
  {
    icon: Newspaper,
    title: 'English & Hindi Newspapers',
    description:
      'Stay updated with daily English and Hindi newspapers.',
    image: newspaperImg,
  },
  {
    icon: BookOpen,
    title: 'Wide Range of Books',
    description:
      'Useful books and study material for different learners.',
    image: booksImg,
  },
  {
    icon: Newspaper,
    title: 'Monthly Magazines',
    description:
      'Access to useful monthly magazines and publications.',
    image: magazineImg,
  },
  {
    icon: Armchair,
    title: 'Separate Seating Cabins',
    description:
      'Comfortable individual seating spaces for focused study.',
    image: cabinImg,
  },
  {
    icon: Printer,
    title: 'Photocopy & Printing',
    description:
      'Printing and photocopy facilities available on-site.',
    image: printingImg,
  },
  {
    icon: Fingerprint,
    title: 'Biometric Attendance',
    description:
      'Secure and accurate attendance management system.',
    image: biometricImg,
  },
];

// ======================================================
// FACILITIES
// ======================================================

const FACILITIES = [
  {
    icon: Droplets,
    title: 'Hot & Cold Pure RO Water',
    image: waterImg,
  },
  {
    icon: Bike,
    title: 'Long Parking Area',
    image: parkingImg,
  },
  {
    icon: Utensils,
    title: 'Separate Lunch Room',
    image: lunchRoomImg,
  },
  {
    icon: Coffee,
    title: 'Tea & Coffee Available',
    image: teaCoffeeImg,
  },
  {
    icon: Users,
    title: 'Separate Area for Girls',
    image: girlsAreaImg,
  },
];

// ======================================================
// SMART FEATURES
// ======================================================

const SMART_FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Online Seat Booking',
    description:
      'Choose your hall, shift and preferred seat and book it online.',
  },
  {
    icon: QrCode,
    title: 'QR Attendance',
    description:
      'Quick check-in and check-out using the library attendance system.',
  },
  {
    icon: Timer,
    title: 'Study Time Tracking',
    description:
      'Track your study sessions and know exactly how much time you spend.',
  },
  {
    icon: Wallet,
    title: 'Online Payments',
    description:
      'Pay your fees online and access your payment receipts easily.',
  },
  {
    icon: Megaphone,
    title: 'Notices & Updates',
    description:
      'Receive important announcements and updates from the library.',
  },
];

// ======================================================
// CARD COLORS
// ======================================================

const CARD_COLORS = [
  {
    border: 'border-[#1B5FAE]/30',
    hoverBorder: 'hover:border-[#1B5FAE]',
    icon: 'from-[#1B5FAE] to-[#29ABE2]',
    shadow:
      'hover:shadow-[0_15px_35px_-10px_rgba(27,95,174,0.35)]',
  },
  {
    border: 'border-[#F7941D]/30',
    hoverBorder: 'hover:border-[#F7941D]',
    icon: 'from-[#F7941D] to-[#FDB813]',
    shadow:
      'hover:shadow-[0_15px_35px_-10px_rgba(247,148,29,0.35)]',
  },
  {
    border: 'border-[#ED1C24]/30',
    hoverBorder: 'hover:border-[#ED1C24]',
    icon: 'from-[#ED1C24] to-[#F04E5A]',
    shadow:
      'hover:shadow-[0_15px_35px_-10px_rgba(237,28,36,0.30)]',
  },
];

// ======================================================
// ANIMATION VARIANTS
// ======================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// ======================================================
// SECTION TITLE
// ======================================================

const SectionTitle = ({
  eyebrow,
  title,
  description,
  light = false,
}) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="text-center max-w-3xl mx-auto mb-12"
    >
      {eyebrow && (
        <span
          className={`inline-block text-sm font-bold uppercase tracking-wider mb-3 ${
            light ? 'text-orange-300' : 'text-[#F7941D]'
          }`}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${
          light ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </h2>

      <div
        className={`w-20 h-1 rounded-full mx-auto my-5 ${
          light ? 'bg-orange-400' : 'bg-[#F7941D]'
        }`}
      />

      {description && (
        <p
          className={`text-base sm:text-lg leading-relaxed ${
            light ? 'text-white/75' : 'text-gray-500'
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
};

// ======================================================
// HOME
// ======================================================

const Home = () => {
  const { library } = useTenant();

  const libraryName = library?.name || 'Your Library';

  return (
    <div className="bg-white overflow-hidden">

      {/* ==================================================
          ORIGINAL HERO SECTION
          KEPT AS YOUR PREVIOUS DESIGN
      ================================================== */}

      <section className="relative px-6 py-20 sm:py-28 text-center overflow-hidden">

        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B4C8C] via-[#F7941D] to-[#ED1C24]" />

        {/* Rotating sunburst */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[36rem] h-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-25 pointer-events-none"
          style={{
            background:
              'repeating-conic-gradient(from 0deg, #FDB813 0deg 8deg, transparent 8deg 20deg)',
            borderRadius: '9999px',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Floating blob 1 */}
        <motion.div
          className="absolute -top-20 -left-16 w-72 h-72 bg-[#29ABE2] rounded-full blur-3xl opacity-40"
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating blob 2 */}
        <motion.div
          className="absolute -bottom-24 -right-16 w-80 h-80 bg-[#FDB813] rounded-full blur-3xl opacity-40"
          animate={{
            x: [0, -30, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative max-w-3xl mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] mb-4"
          >
            {libraryName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="text-white/95 text-base sm:text-lg font-medium max-w-xl mx-auto"
          >
            A smart study-space platform to manage seats,
            attendance, study time, and fees — all in one place.
          </motion.p>

        </div>
      </section>

      {/* ==================================================
          SMART LIBRARY FEATURES
      ================================================== */}

      <section className="px-6 py-20 bg-white">

        <div className="max-w-6xl mx-auto">

          <SectionTitle
            eyebrow="Smart Library"
            title="Everything You Need in One Place"
            description="Our technology-enabled library makes seat booking, attendance, payments and study tracking simple."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >

            {SMART_FEATURES.map((item, index) => {

              const Icon = item.icon;
              const color =
                CARD_COLORS[index % CARD_COLORS.length];

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{
                    y: -8,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className={`
                    group
                    p-6
                    rounded-2xl
                    bg-white
                    border-2
                    ${color.border}
                    ${color.hoverBorder}
                    ${color.shadow}
                    shadow-sm
                    transition-all
                    duration-300
                  `}
                >

                  <div
                    className={`
                      w-14 h-14
                      rounded-2xl
                      bg-gradient-to-br
                      ${color.icon}
                      text-white
                      flex
                      items-center
                      justify-center
                      mb-5
                      shadow-md
                      group-hover:scale-110
                      group-hover:rotate-3
                      transition-all
                      duration-300
                    `}
                  >
                    <Icon size={25} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed">
                    {item.description}
                  </p>

                </motion.div>
              );
            })}

          </motion.div>

        </div>
      </section>

      {/* ==================================================
          SERVICES
      ================================================== */}

      <section className="px-6 py-24 bg-gray-50">

        <div className="max-w-7xl mx-auto">

          <SectionTitle
            eyebrow="What We Offer"
            title="Our Services"
            description="Everything is designed to make your study experience comfortable, productive and hassle-free."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
          >

            {SERVICES.map((service, index) => {

              const Icon = service.icon;
              const color =
                CARD_COLORS[index % CARD_COLORS.length];

              return (
                <motion.div
                  key={service.title}
                  variants={fadeUp}
                  whileHover={{
                    y: -8,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className={`
                    group
                    bg-white
                    rounded-2xl
                    overflow-hidden
                    border-2
                    ${color.border}
                    ${color.hoverBorder}
                    ${color.shadow}
                    shadow-sm
                    transition-all
                    duration-300
                  `}
                >

                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">

                    <img
                      src={service.image}
                      alt={service.title}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-110
                        transition-transform
                        duration-700
                      "
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Icon */}
                    <div
                      className="
                        absolute
                        bottom-4
                        left-4
                        w-11
                        h-11
                        rounded-xl
                        bg-white
                        text-[#1B5FAE]
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        group-hover:scale-110
                        transition-transform
                        duration-300
                      "
                    >
                      <Icon size={21} />
                    </div>

                  </div>

                  {/* Content */}
                  <div className="p-5">

                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {service.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed">
                      {service.description}
                    </p>

                  </div>

                </motion.div>
              );
            })}

          </motion.div>

        </div>
      </section>

      {/* ==================================================
          FACILITIES
      ================================================== */}

      <section className="px-6 py-24 bg-white">

        <div className="max-w-7xl mx-auto">

          <SectionTitle
            eyebrow="Comfort & Convenience"
            title="Our Facilities"
            description="We take care of the little things so that you can concentrate on the things that matter."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
          >

            {FACILITIES.map((facility, index) => {

              const Icon = facility.icon;
              const color =
                CARD_COLORS[index % CARD_COLORS.length];

              return (
                <motion.div
                  key={facility.title}
                  variants={fadeUp}
                  whileHover={{
                    y: -7,
                    scale: 1.01,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                  className={`
                    group
                    rounded-2xl
                    overflow-hidden
                    bg-white
                    border-2
                    ${color.border}
                    ${color.hoverBorder}
                    ${color.shadow}
                    shadow-sm
                    transition-all
                    duration-300
                  `}
                >

                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">

                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="
                        w-full
                        h-full
                        object-contain
                        group-hover:scale-105
                        transition-transform
                        duration-700
                      "
                    />

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

                  </div>

                  {/* Facility content */}
                  <div className="flex items-center gap-4 p-5">

                    <div
                      className={`
                        shrink-0
                        w-11
                        h-11
                        rounded-xl
                        bg-gradient-to-br
                        ${color.icon}
                        text-white
                        flex
                        items-center
                        justify-center
                        shadow-md
                        group-hover:scale-105
                        transition-transform
                        duration-300
                      `}
                    >
                      <Icon size={20} />
                    </div>

                    <h3 className="font-bold text-gray-800">
                      {facility.title}
                    </h3>

                  </div>

                </motion.div>
              );
            })}

          </motion.div>

        </div>
      </section>

      {/* ==================================================
          WHY CHOOSE US
      ================================================== */}

      <section className="relative px-6 py-24 overflow-hidden bg-[#07111f]">

        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#1B5FAE]/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#F7941D]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        <div className="relative max-w-6xl mx-auto">

          <SectionTitle
            light
            eyebrow="Why Gyan Library"
            title="More Than Just a Study Space"
            description="We combine a peaceful environment with modern facilities and smart technology to give students a better study experience."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >

            {[
              'Peaceful & distraction-free environment',
              'Modern and comfortable seating',
              'Reliable power backup',
              'Safe & secure premises',
              'Technology-enabled attendance',
              'Online seat booking',
              'Clean drinking water',
              'Student-friendly facilities',
            ].map((text) => (

              <motion.div
                key={text}
                variants={fadeUp}
                whileHover={{
                  y: -5,
                  borderColor: 'rgba(253,184,19,0.5)',
                }}
                className="
                  flex
                  items-start
                  gap-3
                  bg-white/5
                  border
                  border-white/10
                  rounded-xl
                  p-5
                  backdrop-blur-sm
                  transition-all
                  duration-300
                "
              >

                <CheckCircle2
                  className="text-[#FDB813] shrink-0 mt-0.5"
                  size={21}
                />

                <span className="text-white/85 text-sm leading-relaxed">
                  {text}
                </span>

              </motion.div>
            ))}

          </motion.div>

        </div>
      </section>

      {/* ==================================================
          CTA
      ================================================== */}

      <section className="relative px-6 py-20 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-[#1B5FAE] via-[#0879B9] to-[#F7941D]" />

        <motion.div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">

          <motion.h2
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-white"
          >
            Ready to Start Your Study Journey?
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.1,
            }}
            className="text-white/85 mt-4 max-w-2xl mx-auto"
          >
            Choose your seat, book online and enjoy a comfortable,
            distraction-free environment at {libraryName}.
          </motion.p>

          <motion.a
            href="/booking"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
            }}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              inline-flex
              items-center
              gap-2
              mt-8
              bg-white
              text-[#1B5FAE]
              font-bold
              px-8
              py-4
              rounded-xl
              shadow-xl
            "
          >
            Book Your Seat
            <ArrowRight size={19} />
          </motion.a>

        </div>
      </section>

    </div>
  );
};

export default Home;