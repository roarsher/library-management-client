import React, { useEffect, useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import * as galleryService from '../../services/galleryService';
import * as uploadService from '../../services/uploadService';
import Loader from '../../components/common/Loader';

const ManageGallery = () => {
  const { library } = useTenant();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', eventDate: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [photoFileFor, setPhotoFileFor] = useState({}); // { [galleryId]: FileList }
  const [addingTo, setAddingTo] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await galleryService.listGalleries(library?._id);
      setGalleries(data.galleries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (library?._id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library?._id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      let coverImageUrl = '';
      if (coverFile) {
        coverImageUrl = await uploadService.uploadFile(coverFile, 'gallery');
      }
      const { data } = await galleryService.createGallery({ ...form, coverImageUrl });
      setGalleries((prev) => [data.gallery, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', eventDate: '' });
      setCoverFile(null);
    } finally {
      setCreating(false);
    }
  };

  const handleAddImages = async (galleryId) => {
    const files = photoFileFor[galleryId];
    if (!files || files.length === 0) return;
    setAddingTo(galleryId);
    try {
      const imageUrls = await uploadService.uploadMultipleFiles(files, 'gallery');
      await galleryService.addGalleryImages(galleryId, { imageUrls });
      setPhotoFileFor((prev) => ({ ...prev, [galleryId]: null }));
      alert(`${imageUrls.length} photo(s) added to gallery`);
    } finally {
      setAddingTo(null);
    }
  };

  const handleDelete = async (galleryId) => {
    if (!window.confirm('Delete this gallery and all its photos?')) return;
    await galleryService.deleteGallery(galleryId);
    setGalleries((prev) => prev.filter((g) => g._id !== galleryId));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-gray-800">Gallery</h1>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary text-sm">
          + New Album
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card space-y-3 mb-6">
          <input
            required
            placeholder="Album title, e.g. Saraswati Puja"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
          />
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className="input-field"
          />
          <div>
            <label className="text-xs text-gray-500 block mb-1">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={creating} className="btn-primary text-sm">
            {creating ? 'Creating...' : 'Create Album'}
          </button>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : galleries.length === 0 ? (
        <p className="text-sm text-gray-400">No albums yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {galleries.map((g) => (
            <div key={g._id} className="card">
              {g.coverImageUrl && (
                <img
                  src={g.coverImageUrl}
                  alt={g.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-800">{g.title}</p>
                  {g.eventDate && (
                    <p className="text-xs text-gray-400">{new Date(g.eventDate).toDateString()}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(g._id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setPhotoFileFor((prev) => ({ ...prev, [g._id]: e.target.files }))
                  }
                  className="input-field text-sm flex-1"
                />
                <button
                  onClick={() => handleAddImages(g._id)}
                  disabled={addingTo === g._id}
                  className="btn-secondary text-xs px-3"
                >
                  {addingTo === g._id ? 'Uploading...' : 'Add'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
