import React, { useEffect, useState } from 'react';
import * as broadcastService from '../../services/broadcastService';
import Loader from '../../components/common/Loader';

const ManageBroadcast = () => {
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('all_students');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await broadcastService.listBroadcasts();
      setHistory(data.logs);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const { data } = await broadcastService.sendWhatsAppBroadcast({
        message,
        imageUrl: imageUrl || undefined,
        recipientFilter,
      });
      setResult(data.log);
      setMessage('');
      setImageUrl('');
      loadHistory();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">Broadcast (WhatsApp)</h1>

      <form onSubmit={handleSend} className="card space-y-4 mb-8">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Message</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. 🎉 Get 20% off this Diwali on 3-month plans!"
            className="input-field"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Image URL (optional)</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="input-field"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Send To</label>
          <select
            value={recipientFilter}
            onChange={(e) => setRecipientFilter(e.target.value)}
            className="input-field"
          >
            <option value="all_students">All Verified Students</option>
            <option value="active_only">Currently Active Members</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
        </div>
        <button type="submit" disabled={sending} className="btn-primary w-full">
          {sending ? 'Sending...' : 'Send Broadcast'}
        </button>
        {result && (
          <p className="text-sm text-green-600">
            Sent to {result.recipientCount} students — {result.deliveredCount} delivered,{' '}
            {result.failedCount} failed.
          </p>
        )}
      </form>

      <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Broadcasts</h2>
      {loadingHistory ? (
        <Loader />
      ) : history.length === 0 ? (
        <p className="text-sm text-gray-400">No broadcasts sent yet.</p>
      ) : (
        <div className="space-y-2">
          {history.map((log) => (
            <div key={log._id} className="card">
              <p className="text-sm text-gray-700">{log.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(log.createdAt).toLocaleString()} · {log.deliveredCount}/
                {log.recipientCount} delivered
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBroadcast;
