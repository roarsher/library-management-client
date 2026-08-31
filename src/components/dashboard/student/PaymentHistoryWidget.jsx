import React from 'react';
import StatusBadge from '../../common/StatusBadge';

const PaymentHistoryWidget = ({ payments }) => {
  const recent = (payments || []).slice(0, 5);

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-3">Payment History</h3>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400">No payments yet.</p>
      ) : (
        <div className="space-y-2">
          {recent.map((p) => (
            <div key={p._id} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-700">₹{p.amount}</p>
                <p className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString()} · {p.method}
                </p>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryWidget;
