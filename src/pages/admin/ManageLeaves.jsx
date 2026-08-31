 import React, { useEffect, useState } from 'react';
import * as leaveService from '../../services/leaveService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const TABS = [
  { key: 'pending', label: 'Pending Requests' },
  { key: 'on_leave', label: 'Currently On Leave' },
];

const daysRemaining = (toDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(toDate);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - today) / (1000 * 60 * 60 * 24));
};

const ManageLeaves = () => {
  const [tab, setTab] = useState('pending');
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [onLeave, setOnLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const loadPending = async () => {
    const { data } = await leaveService.listLeaveRequests({ status: 'pending' });
    setPendingLeaves(data.leaves);
  };

  const loadOnLeave = async () => {
    const { data } = await leaveService.listCurrentlyOnLeave();
    setOnLeave(data.leaves);
  };

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'pending') await loadPending();
      else await loadOnLeave();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleDecision = async (id, decision) => {
    setActioningId(id);
    try {
      if (decision === 'approve') await leaveService.approveLeaveRequest(id);
      else await leaveService.rejectLeaveRequest(id);
      setPendingLeaves((prev) => prev.filter((l) => l._id !== id));
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">Leave Requests</h1>

      <div className="flex gap-2 mb-5 border-b border-gray-100">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t.key ? 'border-brand text-brand' : 'border-transparent text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : tab === 'pending' ? (
        pendingLeaves.length === 0 ? (
          <p className="text-sm text-gray-400">No pending leave requests.</p>
        ) : (
          <div className="space-y-3">
            {pendingLeaves.map((l) => (
              <div key={l._id} className="card flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-gray-800">{l.studentId?.userId?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(l.fromDate).toDateString()} → {new Date(l.toDate).toDateString()}
                  </p>
                  {l.reason && <p className="text-xs text-gray-400 mt-1">"{l.reason}"</p>}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={l.status} />
                  <button
                    onClick={() => handleDecision(l._id, 'approve')}
                    disabled={actioningId === l._id}
                    className="btn-primary text-xs px-3 py-1.5"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(l._id, 'reject')}
                    disabled={actioningId === l._id}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : onLeave.length === 0 ? (
        <p className="text-sm text-gray-400">No students currently on leave.</p>
      ) : (
        <div className="space-y-3">
          {onLeave.map((l) => {
            const remaining = daysRemaining(l.toDate);
            return (
              <div key={l._id} className="card flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {l.studentId?.photoUrl ? (
                    <img src={l.studentId.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      {l.studentId?.userId?.name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{l.studentId?.userId?.name}</p>
                    <p className="text-xs text-gray-400">
                      {l.studentId?.userId?.phone} · Seat {l.bookingId?.seatId?.seatNumber || '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">
                    {new Date(l.fromDate).toDateString()} → {new Date(l.toDate).toDateString()}
                  </p>
                  <p className={`text-xs mt-0.5 ${remaining <= 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {remaining <= 0 ? 'Returning today' : `${remaining} day(s) remaining`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageLeaves;