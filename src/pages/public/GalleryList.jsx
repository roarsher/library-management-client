 import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTenant } from '../../context/TenantContext';
import * as galleryService from '../../services/galleryService';
import Loader from '../../components/common/Loader';

const CARD_ACCENTS = [
  'from-[#1B5FAE] to-[#29ABE2]',
  'from-[#F7941D] to-[#FDB813]',
  'from-[#ED1C24] to-[#F04E5A]',
];

const GalleryList = () => {
  const { library } = useTenant();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!library?._id) return;
    galleryService.listGalleries(library._id).then(({ data }) => {
      setGalleries(data.galleries);
      setLoading(false);
    });
  }, [library?._id]);

  if (loading) return <Loader />;

  return (
    <div className="bg-white overflow-hidden">
      {/* Header banner */}
      <section className="relative px-6 py-14 text-center overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B4C8C] via-[#F7941D] to-[#ED1C24] opacity-95" />
        <motion.div
          className="absolute -top-12 -left-8 w-56 h-56 bg-[#29ABE2] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, 25, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-12 -right-8 w-64 h-64 bg-[#FDB813] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-3xl sm:text-4xl font-bold text-white drop-shadow-lg"
        >
          Gallery
        </motion.h1>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-14">
        {galleries.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-400 text-center"
          >
            No albums yet.
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {galleries.map((g, i) => {
              const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
              return (
                <motion.div
                  key={g._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/gallery/${g._id}`} className="block">
                    <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent} z-10`} />
                    <div className="relative overflow-hidden h-40">
                      {g.coverImageUrl ? (
                        <img
                          src={g.coverImageUrl}
                          alt={g.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${accent} opacity-80`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#1B5FAE] group-hover:via-[#F7941D] group-hover:to-[#ED1C24] transition-all duration-300">
                        {g.title}
                      </p>
                      {g.eventDate && (
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(g.eventDate).toDateString()}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryList;