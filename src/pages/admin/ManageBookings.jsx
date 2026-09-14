 import React, { useEffect, useState } from 'react';
import * as bookingService from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const BOOKING_TABS = [
  { key: 'booking_pending', label: 'Pending Bookings', status: 'pending_approval' },
  { key: 'booking_active', label: 'Active', status: 'active' },
  { key: 'booking_on_leave', label: 'On Leave', status: 'on_leave' },
  { key: 'booking_expiring', label: 'Expiring Soon', status: 'expiring' },
  { key: 'booking_cancelled', label: 'Cancelled', status: 'cancelled' },
];

const ManageBookings = () => {
  const [tabKey, setTabKey] = useState('booking_pending');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [rejectReasonFor, setRejectReasonFor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const activeTab = BOOKING_TABS.find((t) => t.key === tabKey) || BOOKING_TABS[0];

  const load = async () => {
    setLoading(true);
    try {
      const params = activeTab.status === 'expiring' ? { expiringWithinDays: 7 } : { status: activeTab.status };
      const { data } = await bookingService.listBookings(params);
      setItems(data.bookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey]);

  const handleVerifyAndApprove = async (id) => {
    setActioningId(id);
    try {
      await bookingService.verifyAndApproveBooking(id);
      setItems((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      window.alert(err.response?.data?.message || 'Could not verify and approve');
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectBooking = async (id) => {
    setActioningId(id);
    try {
      await bookingService.rejectBooking(id, { rejectionReason: rejectReason });
      setItems((prev) => prev.filter((b) => b._id !== id));
      setRejectReasonFor(null);
      setRejectReason('');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Seat Bookings</h1>
      <p className="text-sm text-gray-400 mb-4">
        Review payment screenshots and approve booking requests — verifies payment and allocates the seat in one step.
      </p>

      <div className="flex gap-2 mb-5 border-b border-gray-100 overflow-x-auto">
        {BOOKING_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTabKey(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              tabKey === t.key ? 'border-brand text-brand' : 'border-transparent text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing in this category.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="card flex gap-4 flex-wrap">
              {activeTab.status === 'pending_approval' && item.payment?.screenshotUrl && (
                <img
                  src={item.payment.screenshotUrl}
                  alt="Payment screenshot"
                  className="w-24 h-24 rounded-lg object-cover border border-gray-100 flex-shrink-0 cursor-pointer"
                  onClick={() => window.open(item.payment.screenshotUrl, '_blank')}
                />
              )}

              <div className="flex-1 min-w-0 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-gray-800">
                    {item.studentId?.userId?.name}{' '}
                    <span className="text-gray-400 font-normal text-sm">({item.studentId?.userId?.email})</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Seat {item.seatId?.seatNumber || 'Unassigned'} ·{' '}
                    {item.seatId?.hallId?.name || (item.seatId?.hallId?.hallNumber && `Hall ${item.seatId.hallId.hallNumber}`)} ·{' '}
                    {item.timeSlotId?.label || `${item.timeSlotId?.startTime}-${item.timeSlotId?.endTime}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.durationMonths} month(s) · ₹{item.totalMonthlyAmount}/mo
                    {item.payment && ` · Paid ₹${item.payment.amount} via ${item.payment.method}`}
                    {activeTab.status === 'expiring' && ` · expires ${new Date(item.endDate).toDateString()}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  {activeTab.status === 'pending_approval' && (
                    <>
                      <button
                        onClick={() => handleVerifyAndApprove(item._id)}
                        disabled={actioningId === item._id || !item.payment}
                        title={!item.payment ? 'No payment submitted yet' : ''}
                        className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50"
                      >
                        {actioningId === item._id ? 'Processing...' : 'Verify & Approve'}
                      </button>
                      <button
                        onClick={() => setRejectReasonFor(item._id)}
                        disabled={actioningId === item._id}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {rejectReasonFor === item._id && (
                <div className="w-full flex gap-2 mt-2">
                  <input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="input-field flex-1 text-sm"
                  />
                  <button onClick={() => handleRejectBooking(item._id)} className="btn-primary text-xs px-3">
                    Confirm Reject
                  </button>
                  <button onClick={() => setRejectReasonFor(null)} className="btn-secondary text-xs px-3">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBookings;