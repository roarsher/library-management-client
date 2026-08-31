 import React, { useEffect, useState } from 'react';
import * as libraryService from '../../services/libraryService';
import * as uploadService from '../../services/uploadService';
import Loader from '../../components/common/Loader';

const LibrarySettings = () => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', address: '', contactEmail: '', contactPhone: '', themeColor: '#2563eb' });

  useEffect(() => {
    libraryService.getMyLibrary().then(({ data }) => {
      setLibrary(data.library);
      setForm({
        name: data.library.name || '',
        address: data.library.address || '',
        contactEmail: data.library.contactEmail || '',
        contactPhone: data.library.contactPhone || '',
        themeColor: data.library.themeColor || '#2563eb',
      });
      setLoading(false);
    });
  }, []);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError('');
    try {
      const logoUrl = await uploadService.uploadFile(file, 'library_logo');
      const { data: updated } = await libraryService.updateMyLibrary({ logoUrl });
      setLibrary(updated.library);
      setSuccess('Logo updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleQrChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    setError('');
    try {
      const qrPaymentImageUrl = await uploadService.uploadFile(file, 'qr_code');
      const { data: updated } = await libraryService.updateMyLibrary({ qrPaymentImageUrl });
      setLibrary(updated.library);
      setSuccess('Payment QR updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not upload QR code');
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const { data } = await libraryService.updateMyLibrary(form);
      setLibrary(data.library);
      setSuccess('Settings saved');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Library Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Manage your library's branding and contact details.</p>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">{success}</div>}

      {/* Logo */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Logo</h3>
        <div className="flex items-center gap-4">
          {library?.logoUrl ? (
            <img src={library.logoUrl} alt="Library logo" className="h-16 w-16 rounded-lg object-cover border border-gray-200" />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xl">
              {library?.name?.[0] || 'L'}
            </div>
          )}
          <div>
            <label className="btn-secondary text-sm px-4 py-2 inline-block cursor-pointer">
              {uploadingLogo ? 'Uploading...' : 'Change Logo'}
              <input type="file" accept="image/*" onChange={handleLogoChange} disabled={uploadingLogo} className="hidden" />
            </label>
            <p className="text-xs text-gray-400 mt-1">Square image recommended, at least 200×200px</p>
          </div>
        </div>
      </div>

      {/* Payment QR */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Payment QR Code</h3>
        <p className="text-xs text-gray-400 mb-3">
          Shown to students during manual/UPI payment — e.g. your PhonePe, GPay, or Paytm QR.
        </p>
        <div className="flex items-center gap-4">
          {library?.qrPaymentImageUrl ? (
            <img
              src={library.qrPaymentImageUrl}
              alt="Payment QR"
              className="h-24 w-24 rounded-lg object-contain border border-gray-200 bg-white p-1"
            />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 text-center px-2">
              No QR set
            </div>
          )}
          <div>
            <label className="btn-secondary text-sm px-4 py-2 inline-block cursor-pointer">
              {uploadingQr ? 'Uploading...' : library?.qrPaymentImageUrl ? 'Change QR Code' : 'Upload QR Code'}
              <input type="file" accept="image/*" onChange={handleQrChange} disabled={uploadingQr} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Details */}
      <form onSubmit={handleSaveDetails} className="card space-y-3">
        <h3 className="font-semibold text-gray-800 mb-1">Details</h3>
        <input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Library name" className="input-field w-full" />
        <input value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Address" className="input-field w-full" />
        <input value={form.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} placeholder="Contact email" type="email" className="input-field w-full" />
        <input value={form.contactPhone} onChange={(e) => updateField('contactPhone', e.target.value)} placeholder="Contact phone" className="input-field w-full" />
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Theme color</label>
          <input value={form.themeColor} onChange={(e) => updateField('themeColor', e.target.value)} type="color" className="h-9 w-14 rounded border border-gray-200" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default LibrarySettings;