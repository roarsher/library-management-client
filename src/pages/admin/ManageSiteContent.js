// client/src/pages/admin/ManageSiteContent.jsx
import React, { useEffect, useState } from 'react';
import * as libraryService from '../../services/libraryService';
import * as uploadService from '../../services/uploadService';
import Loader from '../../components/common/Loader';

const emptyFeature = { title: '', description: '', icon: '' };

const ManageSiteContent = () => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    libraryService.getMyLibrary().then(({ data }) => {
      setLibrary(data.library);
      setLoading(false);
    });
  }, []);

  const updateField = (path, value) => {
    setLibrary((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateFeature = (index, field, value) => {
    const features = [...(library.siteContent?.features || [])];
    features[index] = { ...features[index], [field]: value };
    updateField('siteContent.features', features);
  };

  const addFeature = () => {
    updateField('siteContent.features', [...(library.siteContent?.features || []), { ...emptyFeature }]);
  };

  const removeFeature = (index) => {
    updateField(
      'siteContent.features',
      (library.siteContent?.features || []).filter((_, i) => i !== index)
    );
  };

  const updateNotice = (index, field, value) => {
    const notices = [...(library.siteContent?.notices || [])];
    notices[index] = { ...notices[index], [field]: value };
    updateField('siteContent.notices', notices);
  };

  const addNotice = () => {
    updateField('siteContent.notices', [
      { title: '', message: '', date: new Date().toISOString() },
      ...(library.siteContent?.notices || []),
    ]);
  };

  const removeNotice = (index) => {
    updateField(
      'siteContent.notices',
      (library.siteContent?.notices || []).filter((_, i) => i !== index)
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      let logoUrl = library.logoUrl;
      if (logoFile) {
        logoUrl = await uploadService.uploadFile(logoFile, 'library_logo');
      }
      const { data } = await libraryService.updateMyLibrary({
        name: library.name,
        logoUrl,
        themeColor: library.themeColor,
        address: library.address,
        contactEmail: library.contactEmail,
        contactPhone: library.contactPhone,
        siteContent: library.siteContent,
      });
      setLibrary(data.library);
      setLogoFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!library) return null;

  const content = library.siteContent || {};

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Site Content</h1>
      <p className="text-sm text-gray-500 mb-6">
        This is what visitors see on your Home, About, and Contact pages before they log in.
      </p>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Branding</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Library Name</label>
            <input
              value={library.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Logo</label>
            {library.logoUrl && (
              <img src={library.logoUrl} alt="Current logo" className="h-12 w-12 rounded-lg object-cover mb-2" />
            )}
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="input-field" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Theme Color</label>
            <input
              type="color"
              value={library.themeColor || '#2563eb'}
              onChange={(e) => updateField('themeColor', e.target.value)}
              className="h-10 w-20"
            />
          </div>
        </div>

        {/* Home page */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Home Page</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Tagline</label>
            <input
              value={content.tagline || ''}
              onChange={(e) => updateField('siteContent.tagline', e.target.value)}
              className="input-field"
              placeholder="e.g. Book your study seat and stay focused."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600">Features</label>
              <button type="button" onClick={addFeature} className="btn-secondary text-xs px-3">
                + Add Feature
              </button>
            </div>
            {(content.features || []).map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={f.icon}
                  onChange={(e) => updateFeature(i, 'icon', e.target.value)}
                  placeholder="🎟️"
                  className="input-field w-14 text-center"
                />
                <input
                  value={f.title}
                  onChange={(e) => updateFeature(i, 'title', e.target.value)}
                  placeholder="Feature title"
                  className="input-field flex-1"
                />
                <input
                  value={f.description}
                  onChange={(e) => updateFeature(i, 'description', e.target.value)}
                  placeholder="Short description"
                  className="input-field flex-[2]"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-red-400 text-xs px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Latest Notifications</h2>
            <button type="button" onClick={addNotice} className="btn-secondary text-xs px-3">
              + Add Notice
            </button>
          </div>
          <p className="text-xs text-gray-400 -mt-2">
            Shown on your Home page under "Latest Notifications". Newest first.
          </p>
          {(content.notices || []).length === 0 ? (
            <p className="text-sm text-gray-400">No notices added yet.</p>
          ) : (
            (content.notices || []).map((n, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    value={n.title}
                    onChange={(e) => updateNotice(i, 'title', e.target.value)}
                    placeholder="Notice title"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeNotice(i)}
                    className="text-red-400 text-xs px-2"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={n.message}
                  onChange={(e) => updateNotice(i, 'message', e.target.value)}
                  placeholder="Notice details"
                  rows={2}
                  className="input-field"
                />
              </div>
            ))
          )}
        </div>

        {/* About page */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">About Page</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">About Text</label>
            <textarea
              value={content.aboutText || ''}
              onChange={(e) => updateField('siteContent.aboutText', e.target.value)}
              rows={5}
              className="input-field"
              placeholder="Tell visitors about your library, its history, and what makes it different."
            />
          </div>
        </div>

        {/* Contact page */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Contact Page</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Phone</label>
            <input
              value={library.contactPhone || ''}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              value={library.contactEmail || ''}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Address</label>
            <textarea
              value={content.contactAddress || library.address || ''}
              onChange={(e) => updateField('siteContent.contactAddress', e.target.value)}
              rows={2}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Google Maps Embed URL (optional)</label>
            <input
              value={content.mapEmbedUrl || ''}
              onChange={(e) => updateField('siteContent.mapEmbedUrl', e.target.value)}
              className="input-field"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input
              value={content.socialLinks?.facebook || ''}
              onChange={(e) => updateField('siteContent.socialLinks.facebook', e.target.value)}
              placeholder="Facebook URL"
              className="input-field"
            />
            <input
              value={content.socialLinks?.instagram || ''}
              onChange={(e) => updateField('siteContent.socialLinks.instagram', e.target.value)}
              placeholder="Instagram URL"
              className="input-field"
            />
            <input
              value={content.socialLinks?.whatsapp || ''}
              onChange={(e) => updateField('siteContent.socialLinks.whatsapp', e.target.value)}
              placeholder="WhatsApp URL"
              className="input-field"
            />
          </div>
        </div>

        {saved && <p className="text-sm text-green-600">Saved.</p>}
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ManageSiteContent;