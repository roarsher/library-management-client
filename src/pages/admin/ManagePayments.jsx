
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as paymentService from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const ManagePayments = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Deep-linkable:
  // /admin/payments?tab=all&status=verified
  // Defaults to pending manual payments.
  const [tab, setTab] = useState(
    searchParams.get('tab') || 'pending-manual'
  );

  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || ''
  );

  const [pending, setPending] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      if (tab === 'pending-manual') {
        const { data } =
          await paymentService.listPendingManualPayments();

        setPending(data.payments);
      } else {
        const { data } =
          await paymentService.listAllPayments(
            statusFilter
              ? { status: statusFilter }
              : {}
          );

        setAllPayments(data.payments);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    setSearchParams(
      statusFilter
        ? { tab, status: statusFilter }
        : { tab },
      { replace: true }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, statusFilter]);

  const handleDecision = async (id, decision) => {
    setActioningId(id);

    try {
      await paymentService.verifyManualPayment(
        id,
        { decision }
      );

      setPending((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } finally {
      setActioningId(null);
    }
  };

  const totalForView = allPayments.reduce(
    (sum, p) =>
      sum + (p.status === 'verified' ? p.amount : 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      <h1 className="text-xl font-semibold text-gray-800 mb-1">
        Payments
      </h1>

      <p className="text-sm text-gray-500 mb-5">
        Payments submitted as a QR screenshot need manual
        verification against your bank/UPI records.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-gray-100">

        <button
          onClick={() => setTab('pending-manual')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'pending-manual'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500'
          }`}
        >
          Pending Manual
        </button>

        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'all'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-500'
          }`}
        >
          All Payments
        </button>

      </div>

      {loading ? (
        <Loader />

      ) : tab === 'pending-manual' ? (

        /* ---------------- Pending Manual Payments ---------------- */
        pending.length === 0 ? (
          <p className="text-sm text-gray-400">
            No payments awaiting verification.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {pending.map((p) => (
              <div key={p._id} className="card">

                <div className="flex justify-between items-start mb-3">

                  <div>
                    <p className="font-medium text-gray-800">
                      {p.studentId?.userId?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {p.studentId?.userId?.email}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-800">
                    ₹{p.amount}
                  </p>

                </div>

                {p.screenshotUrl && (
                  <img
                    src={p.screenshotUrl}
                    alt="Payment screenshot"
                    className="w-full rounded-lg border border-gray-100 mb-3 max-h-64 object-contain bg-gray-50"
                  />
                )}

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      handleDecision(
                        p._id,
                        'verified'
                      )
                    }
                    disabled={
                      actioningId === p._id
                    }
                    className="btn-primary text-xs flex-1"
                  >
                    Verify
                  </button>

                  <button
                    onClick={() =>
                      handleDecision(
                        p._id,
                        'rejected'
                      )
                    }
                    disabled={
                      actioningId === p._id
                    }
                    className="btn-secondary text-xs flex-1"
                  >
                    Reject
                  </button>

                </div>

              </div>
            ))}

          </div>
        )

      ) : (

        /* ---------------- All Payments ---------------- */
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="input-field w-44"
            >
              <option value="">
                All statuses
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="rejected">
                Rejected
              </option>

              <option value="failed">
                Failed
              </option>
            </select>

            <p className="text-sm text-gray-500">
              Total verified in view:{' '}
              <span className="font-semibold text-gray-800">
                ₹{totalForView.toLocaleString()}
              </span>
            </p>

          </div>

          {allPayments.length === 0 ? (

            <p className="text-sm text-gray-400">
              No payments match this filter.
            </p>

          ) : (

            <div className="space-y-2">

              {allPayments.map((p) => (
                <div
                  key={p._id}
                  className="card flex items-center justify-between"
                >

                  <div>

                    <p className="text-sm font-medium text-gray-800">
                      {p.studentId?.userId?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(
                        p.createdAt
                      ).toLocaleString()}{' '}
                      · {p.method}
                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="text-sm font-semibold text-gray-800">
                      ₹{p.amount}
                    </span>

                    <StatusBadge
                      status={p.status}
                    />

                  </div>

                </div>
              ))}

            </div>
          )}

        </>
      )}

    </div>
  );
};

export default ManagePayments;
 
