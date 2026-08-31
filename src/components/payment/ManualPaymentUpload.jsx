import React, { useState } from 'react';
import * as paymentService from '../../services/paymentService';
import * as uploadService from '../../services/uploadService';

// bookingId and amount are typically passed in via route state or props
// from the booking-confirmation step of your booking flow.
const ManualPaymentUpload = ({ bookingId, amount, qrImageUrl, onSubmitted }) => {
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setScreenshotFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshotFile) {
      setError('Please attach a screenshot of your payment');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const screenshotUrl = await uploadService.uploadFile(screenshotFile, 'payment_screenshot');
      await paymentService.submitManualPayment({ bookingId, amount, screenshotUrl });
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="card text-center py-8">
        <p className="text-green-600 font-medium">Payment submitted</p>
        <p className="text-sm text-gray-500 mt-1">
          An admin will verify it shortly — you'll see the status update on your dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="font-semibold text-gray-800">Pay via QR Code</h3>

      {qrImageUrl && (
        <img src={qrImageUrl} alt="Payment QR" className="w-48 h-48 mx-auto rounded-lg border border-gray-100" />
      )}
      <p className="text-center text-sm text-gray-500">Amount: ₹{amount}</p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <label className="text-sm text-gray-600 mb-1 block">Upload payment screenshot</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="input-field" />
      </div>

      {preview && (
        <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded-lg border border-gray-100" />
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Uploading...' : 'Submit Payment'}
      </button>
    </form>
  );
};

export default ManualPaymentUpload;
