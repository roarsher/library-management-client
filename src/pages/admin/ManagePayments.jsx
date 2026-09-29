 import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as paymentService from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const ManagePayments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await paymentService.listAllPayments(statusFilter ? { status: statusFilter } : {});
      setPayments(data.payments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    setSearchParams(statusFilter ? { status: statusFilter } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Search runs on top of the status filter, matching name, phone or registration number
  const q = search.trim().toLowerCase();
  const visiblePayments = q
    ? payments.filter((p) => {
        const name = p.studentId?.userId?.name?.toLowerCase() || '';
        const phone = p.studentId?.userId?.phone || '';
        const regNo = p.studentId?.registrationNumber?.toLowerCase() || '';
        return name.includes(q) || phone.includes(search.trim()) || regNo.includes(q);
      })
    : payments;

  const totalVerified = visiblePayments.reduce((sum, p) => sum + (p.status === 'verified' ? p.amount : 0), 0);
  const totalDue = visiblePayments.reduce((sum, p) => sum + (p.dueAmount || 0), 0);
  const showingDue = statusFilter === 'due';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Payment History</h1>
      <p className="text-sm text-gray-500 mb-5">
        Full record of all payments. New payments are verified from the Bookings page.
      </p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone or reg. no..."
          className="input-field w-64"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-44">
          <option value="">All statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="due">Due</option>
          <option value="rejected">Rejected</option>
          <option value="failed">Failed</option>
        </select>

        <div className="ml-auto text-sm text-gray-500">
          {showingDue ? (
            <>
              Total due in view:{' '}
              <span className="font-semibold text-red-600">₹{totalDue.toLocaleString()}</span>
            </>
          ) : (
            <>
              Total verified in view:{' '}
              <span className="font-semibold text-gray-800">₹{totalVerified.toLocaleString()}</span>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : visiblePayments.length === 0 ? (
        <p className="text-sm text-gray-400">No payments match this filter.</p>
      ) : (
        <div className="space-y-2">
          {visiblePayments.map((p) => (
            <div key={p._id} className="card flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm font-medium text-gray-800">{p.studentId?.userId?.name}</p>
                <p className="text-xs text-gray-400">
                  {p.studentId?.registrationNumber && `${p.studentId.registrationNumber} · `}
                  {new Date(p.createdAt).toLocaleString()} · {p.method === 'manual_qr' ? 'Online (QR)' : p.method}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">₹{p.amount} paid</p>
                  {p.dueAmount > 0 && (
                    <p className="text-xs font-semibold text-red-600">₹{p.dueAmount} due</p>
                  )}
                </div>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePayments;