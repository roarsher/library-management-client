 import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as studentService from '../../services/studentService';
import * as bookingService from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const ADMISSION_TABS = [
  { key: 'admission_pending', label: 'Pending Admissions', status: 'pending' },
  { key: 'admission_verified', label: 'Verified', status: 'verified' },
  { key: 'admission_rejected', label: 'Rejected', status: 'rejected' },
];

const BOOKING_TABS = [
  { key: 'booking_pending', label: 'Pending Bookings', status: 'pending_approval' },
  { key: 'booking_active', label: 'Active', status: 'active' },
  { key: 'booking_on_leave', label: 'On Leave', status: 'on_leave' },
  { key: 'booking_expiring', label: 'Expiring Soon', status: 'expiring' },
  { key: 'booking_cancelled', label: 'Cancelled', status: 'cancelled' },
];

// Every tab's `status` value is unique across both groups (admission uses
// bare words like "pending"; booking uses "pending_approval", "expiring",
// etc.), so a single ?tab=<status> query param can address any tab in
// either group without collisions. This is what makes the admin dashboard's
// cards (e.g. /admin/bookings?tab=on_leave) land on the right view.
const findTabByStatus = (status) => {
  const admissionMatch = ADMISSION_TABS.find((t) => t.status === status);
  if (admissionMatch) return { group: 'admission', tabKey: admissionMatch.key };
  const bookingMatch = BOOKING_TABS.find((t) => t.status === status);
  if (bookingMatch) return { group: 'booking', tabKey: bookingMatch.key };
  return null;
};

const ManageBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initial = findTabByStatus(searchParams.get('tab')) || {
    group: 'admission',
    tabKey: 'admission_pending',
  };

  const [group, setGroup] = useState(initial.group);
  const [tabKey, setTabKey] = useState(initial.tabKey);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [rejectReasonFor, setRejectReasonFor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const activeTabs = group === 'admission' ? ADMISSION_TABS : BOOKING_TABS;
  const activeTab = activeTabs.find((t) => t.key === tabKey) || activeTabs[0];

  const load = async () => {
    setLoading(true);
    try {
      if (group === 'admission') {
        const { data } = await studentService.listStudents({ status: activeTab.status });
        setItems(data.students);
      } else if (activeTab.status === 'expiring') {
        // Active bookings ending within 7 days — a different query shape
        // than the plain status filters, so it's branched out here.
        const { data } = await bookingService.listBookings({ expiringWithinDays: 7 });
        setItems(data.bookings);
      } else {
        const { data } = await bookingService.listBookings({ status: activeTab.status });
        setItems(data.bookings);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Keep the URL in sync so refreshing or sharing the link preserves
    // the current tab, and so dashboard cards can deep-link straight in.
    setSearchParams({ tab: activeTab.status }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, tabKey]);

  const switchGroup = (g) => {
    setGroup(g);
    setTabKey(g === 'admission' ? 'admission_pending' : 'booking_pending');
  };

  const handleVerify = async (id, decision) => {
    const rejectionReason =
      decision === 'rejected' ? window.prompt('Reason for rejection (optional):') || '' : undefined;
    setActioningId(id);
    try {
      await studentService.verifyAdmission(id, { decision, rejectionReason });
      setItems((prev) => prev.filter((s) => s._id !== id));
    } finally {
      setActioningId(null);
    }
  };

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await bookingService.approveBooking(id);
      setItems((prev) => prev.filter((b) => b._id !== id));
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
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Admissions & Bookings</h1>
      <p className="text-sm text-gray-400 mb-4">
        Verify new admissions and approve seat booking requests from one place.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchGroup('admission')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            group === 'admission' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Admissions
        </button>
        <button
          onClick={() => switchGroup('booking')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            group === 'booking' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Seat Bookings
        </button>
      </div>

      <div className="flex gap-2 mb-5 border-b border-gray-100 overflow-x-auto">
        {activeTabs.map((t) => (
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
          {items.map((item) =>
            group === 'admission' ? (
              <div key={item._id} className="card flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {item.photoUrl ? (
                    <img src={item.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      {item.userId?.name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{item.userId?.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.userId?.email} · {item.userId?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.admissionStatus} />
                  {activeTab.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(item._id, 'verified')}
                        disabled={actioningId === item._id}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleVerify(item._id, 'rejected')}
                        disabled={actioningId === item._id}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div key={item._id} className="card flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-gray-800">
                    {item.studentId?.userId?.name}{' '}
                    <span className="text-gray-400 font-normal text-sm">
                      ({item.studentId?.userId?.email})
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Seat {item.seatId?.seatNumber} ·{' '}
                    {item.seatId?.hallId?.name || `Hall ${item.seatId?.hallId?.hallNumber}`} ·{' '}
                    {item.timeSlotId?.label || `${item.timeSlotId?.startTime}-${item.timeSlotId?.endTime}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.durationMonths} month(s) · ₹{item.totalMonthlyAmount}/mo
                    {activeTab.status === 'expiring' && ` · expires ${new Date(item.endDate).toDateString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  {activeTab.status === 'pending_approval' && (
                    <>
                      <button
                        onClick={() => handleApprove(item._id)}
                        disabled={actioningId === item._id}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        Approve
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
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ManageBookings;