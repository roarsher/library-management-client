 import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as paymentService from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const ManagePayments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
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

  const totalVerified = payments.reduce((sum, p) => sum + (p.status === 'verified' ? p.amount : 0), 0);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Payment History</h1>
      <p className="text-sm text-gray-500 mb-5">
        Full record of all payments. New payments are verified from the Bookings page.
      </p>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-44">
          <option value="">All statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="failed">Failed</option>
        </select>
        <p className="text-sm text-gray-500">
          Total verified in view: <span className="font-semibold text-gray-800">₹{totalVerified.toLocaleString()}</span>
        </p>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-gray-400">No payments match this filter.</p>
      ) : (
        <div className="space-y-2">
          {payments.map((p) => (
            <div key={p._id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{p.studentId?.userId?.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleString()} · {p.method}
                  {p.dueAmount > 0 && ` · ₹${p.dueAmount} due`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">₹{p.amount}</span>
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