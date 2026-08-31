import React, { useEffect, useState } from 'react';
import * as bookingService from '../../services/bookingService';
import * as leaveService from '../../services/leaveService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const LeaveRequest = () => {
  const [activeBooking, setActiveBooking] = useState(null);
  const [pastLeaves, setPastLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [bookingsRes, leavesRes] = await Promise.all([
        bookingService.listBookings({ status: 'active' }),
        leaveService.listLeaveRequests(),
      ]);
      setActiveBooking(bookingsRes.data.bookings?.[0] || null);
      setPastLeaves(leavesRes.data.leaves || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (new Date(toDate) < new Date(fromDate)) {
      setError('End date must be after start date');
      return;
    }

    setSubmitting(true);
    try {
      await leaveService.submitLeaveRequest({ bookingId: activeBooking._id, fromDate, toDate, reason });
      setSuccess(true);
      setFromDate('');
      setToDate('');
      setReason('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Leave Request</h1>
      <p className="text-sm text-gray-500 mb-6">
        Your seat will be temporarily freed for the leave period, and your membership will be
        extended by the same number of days once approved.
      </p>

      {!activeBooking ? (
        <p className="text-sm text-gray-400">You need an active booking to request leave.</p>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-4 mb-8">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">Leave request submitted.</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">From</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">To</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </form>
      )}

      <h2 className="text-sm font-semibold text-gray-700 mb-3">History</h2>
      {pastLeaves.length === 0 ? (
        <p className="text-sm text-gray-400">No past leave requests.</p>
      ) : (
        <div className="space-y-2">
          {pastLeaves.map((l) => (
            <div key={l._id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  {new Date(l.fromDate).toDateString()} → {new Date(l.toDate).toDateString()}
                </p>
                {l.creditedDays > 0 && (
                  <p className="text-xs text-gray-400">{l.creditedDays} day(s) credited</p>
                )}
              </div>
              <StatusBadge status={l.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;
