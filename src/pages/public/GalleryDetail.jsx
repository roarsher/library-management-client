 import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import * as galleryService from '../../services/galleryService';
import Loader from '../../components/common/Loader';

const GalleryDetail = () => {
  const { id } = useParams();
  const { library } = useTenant();
  const [gallery, setGallery] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!library?._id) return;
    galleryService.getGalleryDetail(id, library._id).then(({ data }) => {
      setGallery(data.gallery);
      setImages(data.images);
      setLoading(false);
    });
  }, [id, library?._id]);

  if (loading) return <Loader />;
  if (!gallery) return null;

  return (
    <div className="bg-white overflow-hidden">
      {/* Header banner */}
      <section className="relative px-6 py-14 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B4C8C] via-[#F7941D] to-[#ED1C24] opacity-95" />
        <motion.div
          className="absolute -top-10 -right-10 w-56 h-56 bg-[#29ABE2] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-5xl mx-auto">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Gallery
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-1"
          >
            {gallery.title}
          </motion.h1>
          {gallery.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm text-white/85 max-w-2xl"
            >
              {gallery.description}
            </motion.p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-14">
        {images.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-400 text-center"
          >
            No photos in this album yet.
          </motion.p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 12) * 0.04 }}
                whileHover={{ scale: 1.03 }}
                className="relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || gallery.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {img.caption && (
                  <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                    {img.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryDetail;